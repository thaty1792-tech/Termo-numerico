# Projeto de Jogo Termo Numérico (JS + HTML)

Bem-vindo ao Termo Numérico! Esta é uma versão adaptada do jogo original, focada em adivinhar códigos lógicos de 5 dígitos em vez de palavras.

**Nota de Créditos:** Este projeto foi baseado no trabalho original de outro desenvolvedor e adaptado para suportar uma lógica numérica de 5 dígitos com correção de números repetidos.

# Objetivo do Jogo
Descubra o código secreto de 5 números preenchendo as caixas. Você tem no máximo 7 tentativas para decifrar a sequência correta.

# Como Jogar

1. **Início do Jogo:**
O jogo carrega automaticamente um código secreto de 5 números assim que a página é aberta. Não é necessário selecionar a quantidade de caracteres.

2. **Preencher as Caixas:**
Você verá as caixas para inserir suas tentativas. Digite um número de 0 a 9 em cada campo. O sistema pulará automaticamente para a próxima caixa conforme você digita.

3. **Verificar a Tentativa:**
Após preencher todos os 5 campos de uma linha, pressione a tecla **Enter** no seu teclado para validar a tentativa.

4. **Significado das Cores:**
As caixas mudarão de cor após a verificação para indicar o seu progresso:
* **Verde:** O número está correto e na posição certa.
* **Amarelo:** O número existe no código, mas está na posição errada.
* **Cinza:** O número não pertence ao código secreto.

5. **Lógica de Números Repetidos:**
O jogo possui um sistema inteligente de contagem. Se o código secreto tiver apenas um número "1" e você digitar dois números "1", apenas um será colorido (priorizando o acerto verde), evitando confusão sobre a quantidade de números existentes.

6. **Ganhar ou Perder:**
* Se você acertar o código antes de esgotar as tentativas, o sistema exibirá uma mensagem de vitória.
* Se atingir o limite de 7 tentativas sem acertar, o jogo revelará qual era o número correto na parte inferior da tela.

# Observações Importantes
* O jogo é totalmente responsivo e se ajusta ao tamanho da tela do celular.
* Em dispositivos móveis, o teclado numérico é aberto automaticamente ao clicar em uma caixa.
* Você pode usar o botão "Reiniciar Jogo" a qualquer momento para gerar um novo desafio.

Divirta-se jogando o Termo Numérico!