# QR Stylist - Guia de Manutenção

Este projeto foi construído seguindo princípios de arquitetura modular e baixo acoplamento.

## Estrutura de Pastas
- `src/components/ui`: Componentes atômicos e puros. Não possuem lógica de negócio.
- `src/components/qr`: Componentes específicos de domínio.
    - `SettingsPanel.tsx`: Orquestrador da interface de configuração.
    - `QRPreviewCanvas.tsx`: **Único** ponto de contato com a biblioteca `qr-code-styling`.
- `src/context/QRContext.tsx`: Cérebro da aplicação. Gerencia o estado e orquestra ações globais (como download).
- `src/types/qr.ts`: Definições de tipo rigorosas para garantir consistência de dados.

## Ciclo de Atualização do QR Code
1. O usuário altera um controle no `SettingsPanel`.
2. O `SettingsPanel` dispara uma atualização no `QRContext`.
3. O `QRPreviewCanvas` observa a mudança na propriedade `options` do estado.
4. Ao invés de remontar o componente, o `QRPreviewCanvas` utiliza o método nativo `.update()` da instância da biblioteca capturada em um `useRef`.

Isso garante que a aplicação seja extremamente fluida e que a renderização do Canvas não cause travamentos na interface do usuário (Main Thread).
