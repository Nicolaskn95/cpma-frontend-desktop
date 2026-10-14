# CPMA - Central de Penas e Medidas Alternativas (Frontend Desktop)

Aplicação Desktop desenvolvida com **React 19**, **Vite**, **Tailwind CSS** e empacotada com **Electron**, projetada para a gestão de penas alternativas, controle de frequência e terminal de autoatendimento biométrico (Totem Kiosk).

Desenvolvido para o **Governo do Estado de São Paulo / Comarca de Votorantim** em cooperação com a **FATEC Sorocaba**.

---

## 🚀 Funcionalidades

- 👤 **Gestão de Apenados**: Cadastro completo com validação de CPF, dados residenciais e foto biométrica.
- 🏢 **Instituições Conveniadas**: Cadastro de órgãos parceiros com grade semanal de turnos e disponibilidades.
- ⚖️ **Execução Penal**: Cadastro de penas alternativas (PSC), cálculo automático de semanas, meses e previsão de término.
- 📝 **Folha de Ponto / Registros de Trabalho**: Lançamento de frequência diária ou grade mensal com cálculo automático de horas.
- 📱 **Totem Kiosk Autoatendimento**: Terminal oficial com teclado virtual para inserção de PIN de 6 dígitos e validação biométrica facial pela webcam.
- 🔍 **Biometria Facial**: Reconhecimento e identificação facial em tempo real.
- 🛡️ **Auditoria e Relatórios**: Histórico detalhado de acessos ao terminal e estatísticas de cumprimento.

---

## 🛠️ Tecnologias Utilizadas

- **React 19** + **TypeScript**
- **Vite 6** (Build tool e dev server)
- **Tailwind CSS v4**
- **Electron** (Execução nativa desktop para Windows, Linux e macOS)
- **Lucide React** (Ícones da interface)

---

## 📦 Como Executar Localmente

### 1. Clonar o repositório
```bash
git clone https://github.com/Nicolaskn95/cpma-frontend-desktop.git
cd cpma-frontend-desktop
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Executar na Web (Navegador)
```bash
npm run dev
```
Acesse: [http://localhost:3000](http://localhost:3000)

### 4. Executar como Aplicativo Desktop (Electron)
```bash
npm run electron
```

### 5. Gerar Build de Produção
```bash
npm run build
```

---

## 📤 Publicar no GitHub (`Nicolaskn95`)

Se você acabou de criar o repositório vazio no GitHub (`cpma-frontend-desktop`), execute:

```bash
git remote add origin https://github.com/Nicolaskn95/cpma-frontend-desktop.git
git branch -M main
git push -u origin main
```

---

## 📄 Licença

Distribuído sob a licença MIT.
