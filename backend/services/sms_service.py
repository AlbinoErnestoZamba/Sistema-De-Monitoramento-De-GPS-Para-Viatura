# backend/services/sms_service.py
import os
import requests
import json # Importar 'json' para lidar com possíveis erros de decodificação

# Novas variáveis de ambiente para a chave da Termii API e Sender ID
TERMII_API_KEY = os.getenv("TERMII_API_KEY")
TERMII_SENDER_ID = os.getenv("TERMII_SENDER_ID", "Termii") # Use "Termii" como padrão se não definido

# Nova URL da API para a Termii (endpoint de envio de SMS)
TERMII_SMS_API_URL = "https://api.ng.termii.com/api/sms/send"

# DEBUG prints (mantenha-os por enquanto para verificar)
print(f"DEBUG: TERMII_API_KEY lido do .env: '{TERMII_API_KEY}'")
print(f"DEBUG: TERMII_SENDER_ID lido do .env: '{TERMII_SENDER_ID}'")


def send_sms(to_number: str, message_text: str):
    """
    Envia uma mensagem SMS usando a Termii API.

    Args:
        to_number (str): O número de telefone do destinatário (ex: "2449XXXXXXXXX" - sem o '+' inicial para Termii).
        message_text (str): O conteúdo da mensagem SMS.

    Returns:
        dict: Um dicionário com o status ('success' ou 'error') e os dados/mensagem.
    """
    if not TERMII_API_KEY:
        print("Erro: Chave da Termii API (TERMII_API_KEY) não configurada no .env")
        return {"status": "error", "message": "Chave da Termii API ausente."}

    # A Termii geralmente prefere o número sem o '+' inicial, ex: "2449xxxxxxxx"
    cleaned_to_number = to_number.replace("+", "")

    headers = {
        "Content-Type": "application/json"
    }

    payload = {
        "api_key": TERMII_API_KEY,
        "to": cleaned_to_number,
        "from": TERMII_SENDER_ID,  # O Sender ID é obrigatório pela Termii
        "sms": message_text,
        "type": "plain",     # "plain" para texto simples, "unicode" para caracteres especiais
        "channel": "generic" # Canal genérico, pode ser "dnd" para números em lista de não perturbe (se habilitado)
    }

    print(f"DEBUG: Payload enviado para Termii API: {payload}")
    print(f"DEBUG: URL da API usada: '{TERMII_SMS_API_URL}'")

    try:
        response = requests.post(TERMII_SMS_API_URL, headers=headers, json=payload)

        # Tentativa de decodificar a resposta como JSON
        try:
            response_json = response.json()
            print(f"DEBUG: Resposta completa JSON da Termii API: {response_json}")

            # >>>>>>>>>> AQUI ESTÁ A MUDANÇA CRÍTICA <<<<<<<<<<
            # A Termii retorna 'status': 'success' e 'code': 'ok' para sucesso.
            # Se 'status' for 'error' ou 'code' não for 'ok', é um erro.
            if response_json.get("status") == "success" and response_json.get("code") == "ok":
                print(f"SMS enviado com sucesso via Termii API! Resposta: {response_json.get('message')}")
                return {"status": "success", "data": response_json}
            else:
                # É um erro retornado pela API da Termii no JSON
                error_message = response_json.get("message", "Erro desconhecido na resposta JSON da Termii API.")
                # Inclua o código de erro da Termii para mais detalhes
                if response_json.get("code"):
                    error_message = f"Termii Code: {response_json['code']} - {error_message}"
                print(f"Erro lógico da Termii API (SMS NÃO ENVIADO): {error_message}")
                return {"status": "error", "message": f"Erro da Termii: {error_message}"}

        except json.JSONDecodeError:
            # Caso a resposta não seja um JSON válido (ex: HTML de erro, ou string vazia)
            print(f"Erro: Resposta da Termii API não é JSON válida. Status HTTP: {response.status_code}. Conteúdo: {response.text}")
            return {"status": "error", "message": f"Resposta inválida da Termii API (HTTP {response.status_code}). Conteúdo: {response.text[:200]}..."} # Limita o print do conteúdo

    except requests.exceptions.RequestException as e:
        # Este bloco captura erros de rede (DNS, conexão, timeouts) ou status HTTP 5xx (erro interno do servidor da Termii)
        print(f"Erro de conexão/rede ou HTTP 5xx ao enviar SMS para {to_number} via Termii API: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Termii API Erro de Resposta HTTP ({e.response.status_code}): {e.response.text}")
            return {"status": "error", "message": f"Falha na conexão/servidor ao enviar SMS (HTTP {e.response.status_code}): {e.response.text}"}
        return {"status": "error", "message": f"Falha na conexão ao enviar SMS: {str(e)}"}