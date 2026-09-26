# Pacote de design: Ice Tea Leão Pêssego (Nível 1, jornada única)

Projeto conceitual de estudo e portfólio. Sem vínculo com a Leão ou com The Coca-Cola Company.

**Desvio declarado (26/09/2026):** o Higgsfield só gera imagem e vídeo pela conexão a partir do plano pago, e o usuário escolheu seguir com custo zero. O vídeo de despejo virou um desenho em SVG guiado pela rolagem: mesmo mapa de faixas, mesmo roteiro (fio de chá caindo, copo enchendo, câmera descendo, gotas no vidro, repouso com o copo cheio). Por ser leve, o despejo animado roda também no celular. O hero estático fica só para movimento reduzido e celular deitado baixo. O rodapé diz que as ilustrações foram feitas em código, não por IA.

## 1. A premissa da marca

**Gelado no ponto.** O site inteiro ensina e vende uma ideia só: ice tea bom é o que chega trincando, com chá preto de verdade e o doce do pêssego por cima. O vídeo enche o copo, o momento interativo gela a garrafa, o FAQ ensina a guardar longe do calor, e a chamada final manda a pessoa buscar o dela.

## 2. A paleta (direção; valores finais amostrados da filmagem aprovada)

Tirada do rótulo verde-azulado da garrafa, do dourado do chá e do laranja do logo.

```css
:root{
  --canvas:#0F2B28;        /* verde-azulado profundo do rótulo, nunca preto */
  --panel:#163B37;         /* cartões e superfícies */
  --ice:#E8F3F0;           /* seções claras, branco gelado tingido */
  --tea:#C9761F;           /* o dourado do chá, luz e brilhos */
  --accent:#FB5700;        /* laranja do logo: só o CTA, foco e um ou dois destaques */
  --accent-hover:#FF7428;
  --accent-muted:#F4A57A;  /* pêssego em nível de sussurro: bordas, partículas */
  --text-secondary:#A8C4BE;
  --text-primary:#F2F7F3;
}
```

Texto sobre o laranja é escuro (#0B1F1D, contraste 5,3:1). Branco sobre laranja falha.

## 3. O trio de fontes

- Display: **Bricolage Grotesque** 700 e 800. Cara jovem, com personalidade, conversa com as letras arredondadas do logo.
- Texto: **Figtree** 400 e 600.
- Mono: **DM Mono** 400 e 500, para etiquetas, temperatura e números.

## 4. O mapa de faixas (hero de 520vh; pontos de partida, validados pelo teste de flick)

Composição: o copo vive no terço direito do quadro. O texto vive à esquerda, sobre a parede verde-azulada calma.

| Faixa | Intervalo | Momento da filmagem | Texto (ao pé da letra) | Entrada |
|---|---|---|---|---|
| 1 | 0.00 a 0.22 | o fio de chá começa a cair no copo com gelo | "Calor lá fora." / "Aqui dentro, o gelo já tá esperando." | deriva para baixo, ecoando o despejo |
| 2 | 0.27 a 0.50 | o chá sobe, o gelo balança, o pêssego gira | "Chá preto de verdade." / "Com o doce do pêssego no ponto." | enchendo: cada palavra sobe de dentro de uma máscara, como o nível do copo |
| 3 | 0.55 a 0.78 | o fio afina, gotas se formam no vidro | "Gelado no ponto." / "Do primeiro gole ao último cubo." | desfoque para nítido, como vidro embaçado limpando |
| 4 | 0.84 a 1.00 | copo cheio em repouso, gotas escorrendo | Título "Ice Tea Leão Pêssego" / "Um gole de pausa no meio do dia." / botões "Achar perto de mim" e "Ver o que tem dentro" | subida palavra por palavra em etapas |

## 5. O bloco do hero estático (celular e movimento reduzido)

- Título: "Ice Tea Leão Pêssego"
- Subtítulo: "Chá preto de verdade, doce de pêssego, gelado no ponto."
- CTA: "Achar perto de mim"

## 6. O esboço abaixo da dobra

1. **Dentro da garrafa** (foto da garrafa do usuário)
   - Etiqueta: "Dentro da garrafa"
   - Título: "Chá, pêssego e gelo."
   - Linha: "O sabor que você já conhece, explicado em três goles."
   - Chá preto: "Encorpado, feito pra ser tomado gelado."
   - Pêssego: "O toque doce e suculento que todo mundo pede."
   - Gelo: "Esse é por sua conta. Quanto mais, melhor."
2. **Segura pra gelar** (o momento interativo)
   - Título: "Segura pra gelar."
   - Linha: "Ice tea bom é ice tea trincando. Segura o botão e deixa o gelo trabalhar."
   - Botão: "Segura aqui"
   - Leitura: 26 °C descendo até 4 °C
   - Ao completar: "No ponto. Agora sim." e a dica "Guarda longe do sol e serve bem gelado. Calor muda o sabor."
3. **Quando bate a vontade** (quatro cartões iguais, ilustração SVG em cada)
   - "Intervalo da aula." / "Dez minutos, um gole, cabeça no lugar."
   - "Volta do treino." / "Garrafa suando na mão, sol na cara."
   - "Tarde de calor." / "Ventilador não resolve. Isso aqui resolve."
   - "Série com a galera." / "A garrafa grande vai de mão em mão."
4. **Faixa corrida**: "bem gelado · chá preto · pêssego · pausa · trincando · pra dividir ·"
5. **Perguntas da galera** (FAQ)
   - "É muito doce?" / "É docinho, do jeito que ice tea é. Se quiser menos açúcar, tem a versão Zero no mesmo sabor."
   - "Tem chá de verdade?" / "Tem. A base é chá preto, com o toque de pêssego por cima."
   - "Por que às vezes o gosto muda?" / "Calor e sol mexem com o sabor. Guarda em lugar fresco e toma bem gelado."
   - "Onde eu acho?" / "Mercado, padaria, farmácia e app de entrega. Tem garrafa de 450 ml pra levar e de 1,5 litro pra dividir."
   - "Pêssego ou limão?" / "A dúvida cruel. Este site é time pêssego, mas a gente respeita."
6. **Chamada final** (quadro final do vídeo como fundo)
   - Título: "Tá calor? Você já sabe."
   - Botão: "Achar perto de mim" (abre a busca de mercados próximos no Google Maps)
   - Destino: nenhum formulário. O produto já é vendido em outro lugar, então o CTA leva direto para a busca.
7. **Rodapé**: logo, "Projeto conceitual de estudo e portfólio. Sem vínculo com a Leão ou com The Coca-Cola Company. Leão e Ice Tea Leão são marcas de seus donos. As ilustrações e animações foram feitas em código para este estudo."

## 7. O plano da camada vetorial

- **Elemento assinatura: o copo lateral.** Um copo fino desenhado em SVG na borda direita, fixo, que enche de chá conforme a página desce, com dois cubos de gelo e uma fatia de pêssego boiando. Cheio na chamada final. Escondido em telas estreitas e baixas.
- Gotas de condensação desenhadas que escorrem devagar nas bordas das seções escuras, nível de sussurro.
- Linhas SVG em forma de fio de chá que se traçam no scroll entre as seções.
- Partículas de bolha subindo devagar no fundo.
- Camada fixa de ambiente: luz de sol filtrada por folhas derivando sobre o verde-azulado, ciclo de 60 s ou mais.
- Movimento reduzido: tudo nos estados finais, motores parados.

## 8. A lista de engenharia

Busca por Blob com anel de carregamento, interpolação normalizada por dt, seeks travados, escritas de DOM com delta, faixas ritmadas em vh com teste de flick, sistema de legibilidade de quatro camadas, cinco portões do hero estático vivos com listeners de mudança, página completa sem o vídeo, piso de qualidade completo e o padrão site-inteiro-animado.

## 9. A linha do gate de texto

Cada linha acima embarca ao pé da letra. A página passa no gate da Fase 9 antes de alguém ver: zero travessões, zero palavras de estoque e a varredura por sinais de IA. Os trios desenhados ("Chá, pêssego e gelo.") são ofício e ficam.
