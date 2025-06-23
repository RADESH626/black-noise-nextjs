using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Networking;
using System.Collections;
using UnityEngine.SceneManagement;
using System.Security.Cryptography.X509Certificates;

public class LoginAuthManager : MonoBehaviour
{
    [Header("UI References")]
    public GameObject inicioSesionPanel;
    public InputField emailField;
    public InputField passwordField;
    public Button loginButton;
    public Text errorText;
    public GameObject loadingIndicator;

    [Header("API Configuration")]
    // Configuración automática para desarrollo y producción
#if UNITY_EDITOR
    private string apiUrl = "http://localhost:3000/api/auth/login"; // Desarrollo local
#else
    private string apiUrl = "https://4.228.49.46:3000/api/auth/login"; // Producción
#endif

    void Start()
    {
        // Verificar que el panel está asignado
        if (inicioSesionPanel == null)
        {
            Debug.LogError("inicioSesionPanel no está asignado en el Inspector!");
#if UNITY_EDITOR
            inicioSesionPanel = GameObject.Find("InicioSesionPanel");
            if (inicioSesionPanel != null)
            {
                Debug.Log("Panel encontrado automáticamente: " + inicioSesionPanel.name);
            }
#endif
        }

        if (inicioSesionPanel != null)
        {
            inicioSesionPanel.SetActive(true);
        }

        loginButton.onClick.AddListener(TryLogin);

        // Autocompletar credenciales en editor
#if UNITY_EDITOR
        if (emailField != null) emailField.text = "wilmr2001@gmail.com";
        if (passwordField != null) passwordField.text = "Contraseña123@";
#endif
    }

    public void TryLogin()
    {
        StartCoroutine(LoginRequest());
    }

    IEnumerator LoginRequest()
    {
        // Validar campos
        if (string.IsNullOrEmpty(emailField.text) || string.IsNullOrEmpty(passwordField.text))
        {
            errorText.text = "Por favor completa todos los campos";
            yield break;
        }

        // Crear JSON con credenciales
        LoginData data = new LoginData
        {
            username = emailField.text, // Cambiado a username
            password = passwordField.text
        };
        string jsonData = JsonUtility.ToJson(data);

        using (UnityWebRequest request = new UnityWebRequest(apiUrl, "POST"))
        {
            byte[] jsonBytes = System.Text.Encoding.UTF8.GetBytes(jsonData);
            request.uploadHandler = new UploadHandlerRaw(jsonBytes);
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");

            // Solución SSL para desarrollo y producción
            request.certificateHandler = new CustomCertificateHandler();

            // Mostrar estado de carga
            SetLoadingState(true);
            errorText.text = "Verificando credenciales...";

            yield return request.SendWebRequest();

            // Ocultar indicador de carga
            SetLoadingState(false);

            if (request.result == UnityWebRequest.Result.ConnectionError)
            {
                errorText.text = "Error de conexión: " + request.error;
                Debug.LogError("Error de conexión: " + request.error);
            }
            else if (request.result == UnityWebRequest.Result.ProtocolError)
            {
                HandleHttpError(request.responseCode);
            }
            else
            {
                HandleLoginResponse(request.downloadHandler.text);
            }
        }
    }

    private void SetLoadingState(bool isLoading)
    {
        if (loadingIndicator != null)
        {
            loadingIndicator.SetActive(isLoading);
        }

        // Deshabilitar interacción durante la carga
        loginButton.interactable = !isLoading;
        emailField.interactable = !isLoading;
        passwordField.interactable = !isLoading;
    }

    private void HandleHttpError(long responseCode)
    {
        switch (responseCode)
        {
            case 400:
                errorText.text = "Solicitud incorrecta. Verifica los datos.";
                break;
            case 401:
                errorText.text = "Credenciales inválidas. Intenta nuevamente.";
                break;
            case 404:
                errorText.text = "Servicio no encontrado. Contacta al soporte.";
                break;
            case 500:
                errorText.text = "Error interno del servidor. Intenta más tarde.";
                break;
            default:
                errorText.text = $"Error inesperado: {responseCode}";
                break;
        }
    }

    private void HandleLoginResponse(string jsonResponse)
    {
        try
        {
            LoginResponse response = JsonUtility.FromJson<LoginResponse>(jsonResponse);

            if (response.valid)
            {
                // Guardar datos de usuario
                PlayerPrefs.SetString("UserID", response.userData.id);
                PlayerPrefs.SetString("UserName", response.userData.name);
                PlayerPrefs.SetString("UserEmail", response.userData.email);
                PlayerPrefs.Save();

                // Cambiar a escena de menú
                SceneManager.LoadScene("MenuScene");
            }
            else
            {
                errorText.text = response.message ?? "Error desconocido en el inicio de sesión";
            }
        }
        catch (System.Exception e)
        {
            errorText.text = "Error procesando respuesta: " + e.Message;
            Debug.LogError("JSON Parse Error: " + e.Message);
            Debug.Log("JSON Response: " + jsonResponse);
        }
    }

    // Clases auxiliares para serialización JSON
    [System.Serializable]
    private class LoginData
    {
        public string username; // Cambiado a username
        public string password;
    }

    [System.Serializable]
    private class UserData
    {
        public string id;
        public string name;
        public string email;
    }

    [System.Serializable]
    private class LoginResponse
    {
        public bool valid;
        public string message;
        public UserData userData;
    }

    // Handler personalizado para certificados
    private class CustomCertificateHandler : CertificateHandler
    {
        protected override bool ValidateCertificate(byte[] certificateData)
        {
            // Permitir cualquier certificado en desarrollo
#if UNITY_EDITOR || DEVELOPMENT_BUILD
            return true;
#else
                // Validación estricta en producción
                try
                {
                    var certificate = new X509Certificate2(certificateData);
                    return certificate.Verify();
                }
                catch
                {
                    return false;
                }
#endif
        }
    }

    public void ShowInicioPanel()
    {
        if (inicioSesionPanel != null)
        {
            inicioSesionPanel.SetActive(true);
        }
        else
        {
            Debug.LogError("ShowInicioPanel: inicioSesionPanel no está asignado!");
        }
    }

    public void HideInicioPanel()
    {
        if (inicioSesionPanel != null)
        {
            inicioSesionPanel.SetActive(false);
        }
    }
}
