# Ascend - Aplicativo de Finanças Pessoais

Aplicativo mobile completo para gestão financeira pessoal, construído com React Native e Expo. Interface moderna e intuitiva para controle de transações, orçamentos e sistema de cobranças.

## 📱 Screenshots

[Adicione screenshots do aplicativo aqui]

## 🚀 Funcionalidades

- **🔐 Autenticação Biométrica** - Login seguro com biometria
- **📊 Dashboard Financeiro** - Visão geral das finanças mensais
- **💰 Gestão de Transações** - Controle completo de receitas e despesas
- **📝 Sistema de Cobranças** - Gerenciamento de débitos e pagamentos parcelados
- **🏦 Contas Múltiplas** - Suporte a diferentes contas bancárias
- **📈 Relatórios** - Gráficos e análises financeiras
- **🔔 Lembretes** - Notificações para cobranças e pagamentos
- **📱 WhatsApp Integration** - Envio de cobranças via WhatsApp

## 🛠 Tecnologias

- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **TypeScript** - Linguagem tipada
- **React Navigation** - Navegação
- **React Native Reanimated** - Animações
- **Async Storage** - Armazenamento local
- **Axios** - Cliente HTTP
- **React Hook Form** - Gerenciamento de formulários
- **Styled Components** - Estilização

## 🏗 Arquitetura

- **Context API** - Gerenciamento de estado
- **Custom Hooks** - Lógica reutilizável
- **Service Layer** - Comunicação com API
- **Component Pattern** - Componentes reutilizáveis
- **TypeScript Types** - Tipagem forte

## ⚙️ Configuração

### Pré-requisitos

- Node.js (v18 ou superior)
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app (iOS/Android) ou simulador
- [Backend API](https://github.com/your-username/ascend-financas-api) rodando

### Instalação

1. Clone o repositório
```bash
git clone https://github.com/your-username/ascend-financas-app.git
cd ascend-financas-app
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env`:
```env
API_BASE_URL="http://YOUR_LOCAL_IP:3000"
```

4. Inicie o projeto
```bash
npm start
# ou
expo start
```

5. Abra no simulador ou dispositivo
- **iOS Simulator**: Pressione `i` no terminal
- **Android Emulator**: Pressione `a` no terminal
- **Dispositivo físico**: Escaneie o QR code com o app Expo Go

## 📦 Build para Produção

### Android (APK)
```bash
expo build:android
```

### iOS (IPA)
```bash
expo build:ios
```

### EAS Build (Recomendado)
```bash
# Configure EAS
eas build:configure

# Build para Android
eas build --platform android

# Build para iOS
eas build --platform ios
```

## 🧪 Estrutura do Projeto

```
src/
├── api/                 # Configuração de API e serviços
├── assets/              # Imagens, fontes e recursos
├── components/          # Componentes reutilizáveis
├── contexts/            # Context providers
├── hooks/               # Custom hooks
├── navigation/          # Configuração de navegação
├── screens/             # Telas do aplicativo
├── services/            # Serviços e integrações
├── styles/              # Temas e estilos globais
├── types/               # Definições TypeScript
└── utils/               # Funções utilitárias
```

## 🔒 Segurança

- Autenticação JWT com refresh automático
- Armazenamento seguro com AsyncStorage
- Validação de entrada em todos os formulários
- Autenticação biométrica (TouchID/FaceID)
- Interceptadores para tratamento de erros

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Ícaro Aguiar**
- GitHub: [@IcaroAguiar](https://github.com/IcaroAguiar)
- LinkedIn: [Ícaro Aguiar](https://linkedin.com/in/icaro-aguiar)

---

**Backend:** [Ascend Financial API](https://github.com/your-username/ascend-financas-api)

> 💡 **Dica:** Para desenvolvimento local, certifique-se de que a API backend esteja rodando e a variável `API_BASE_URL` esteja configurada corretamente com o IP da sua máquina.