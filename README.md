# 📷 MLKit Text Reader

Aplicativo **React Native** para leitura de texto em imagens usando **Google ML Kit** e câmera do dispositivo.  
O projeto foi desenvolvido em **JavaScript puro** para simplificar a configuração e acelerar o desenvolvimento.

---

## 🚀 Tecnologias
- **React Native**  
- **Vision Camera**  
- **Google ML Kit**  

---

## 📦 Pré-requisitos
Antes de rodar o projeto, certifique-se de ter instalado:

- **Node.js**  
- **Java JDK 17+**  
- **Android Studio** com SDK configurado  
- Ambiente **React Native** configurado ([Guia oficial](https://reactnative.dev/docs/set-up-your-environment))  

---

## 🛠️ Instalação e uso

```bash
# 1. Clonar o repositório
git clone https://github.com/victorcassio/MLKit-Text-Reader.git

# 2. Entrar no diretório
cd MLKit-Text-Reader

# 3. Instalar dependências
npm install

# 4. Iniciar o servidor Metro
npm start

# 5. Rodar no Android (porta customizada para evitar conflitos)
npx react-native run-android --port 8088

# (Opcional) Rodar no iOS
npx pod-install ios
npx react-native run-ios
```

---

## 📌 Observações
É necessário conceder permissão de câmera no dispositivo/emulador.

Para usar ML Kit, certifique-se de ter o Google Play Services atualizado.

Caso ocorra erro de build relacionado ao Ninja ou CMake, instale-os pelo Android Studio → SDK Tools.

---

## 📚 Aprendendo mais
Documentação React Native

ML Kit Vision Docs

Vision Camera Docs

---