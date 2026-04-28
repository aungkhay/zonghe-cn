<template>
    <div class="p-3 text-gray-600 text-sm">
        <div v-if="common.getParamsLang() == 'zh'">
            <div class="font-bold text-black">乐天国际-腾龙集团直属品牌，亚洲最具有实力平台。</div>

            <div class="font-bold text-black mt-5">品牌信誉:</div>
            乐天国际（Royal Entertainment）是 腾龙集团旗下直属运营平台，持有 缅甸、菲律宾、柬埔寨、越南
            等多国合法博彩牌照。凭借雄厚的集团实力与多年的行业经验，乐天国际秉持“公正、诚信、安全、创新的经营理念，致力于打造全球最具公信力的线上娱乐品牌。
            平台采用国际领先的加密技术与安全防护体系，通过多重数据验证及权威机构认证，确保所有会员信息与交易数据的 绝对安全与隐私保护。乐天国际凭借出色的信誉保障与稳定的运营体系，赢得全球玩家一致好评，成为值得信赖的首选品牌。

            <div class="font-bold text-black mt-5">诚信为本:</div>
            以诚信立足，以口碑长存
            乐天国际坚信，信誉是品牌的生命。我们承诺为每一位玩家提供 最公平、最透明、最安全 的博彩体验。所有游戏结果均通过国际权威机构实时监测，确保 公平公正公开。
            我们采用全球领先的游戏系统，操作流畅、画面精致、无需下载，兼容多端设备。您可以随时随地畅玩，享受极致娱乐体验。

            <div class="font-bold text-black mt-5">游戏多样化 · 畅享无限乐趣</div>
            乐天国际汇聚全球顶级游戏平台，囊括：
            真人视讯：与性感美女荷官实时互动，体验最真实的赌场氛围。热门项目包括真人百家乐、龙虎斗、轮盘、骰宝等。
            体育竞技：涵盖全球上千场体育赛事，实时赔率、公平透明，尽享赛事激情。
            电子游艺：精选上百款高人气老虎机与街机游戏，轻松上手、趣味无穷。
            乐天国际以 丰富的游戏内容、极致的视觉体验与公平的中奖机制，带您领略真正的娱乐盛宴。

            <div class="font-bold text-black mt-5">网络安全与隐私保障:</div>
            为保障用户隐私与交易安全，乐天国际采用 “国际银行级 SSL 128位加密技术”，并由多国安全机构联合监测审计，确保每一笔存取款交易安全无忧。
            所有会员资料均经过 多重防护与加密处理，严格遵守数据保护法规，保障玩家隐私权益。

            <div class="font-bold text-black mt-5">客户服务 · 专业贴心</div>
            乐天国际以“客户至上，服务为先”为宗旨，组建了专业的国际客服团队，全年 365天 × 24小时 全天候在线，为您提供：

            <ol class="list-decimal list-inside space-y-1 my-3">
                <li>快速、安全的存取款处理</li>
                <li>多语言客服支持与实时互动</li>
                <li>定期推出优惠活动与专属奖励</li>
                <li>即时响应会员建议与需求反馈</li>
            </ol>

            无论您身处何地，乐天国际都为您提供 宾至如归的服务体验。

            <div class="font-bold text-black mt-5">社会责任 · 回馈公益</div>
            乐天国际深知企业的社会责任，始终积极投身于各国的 慈善与社会公益事业，以行动诠释企业担当，为社区发展与慈善事业贡献力量。

            责任博彩
            乐天国际提倡理性娱乐，坚决反对未成年人赌博行为。
            我们鼓励玩家制定合理预算、量力而行，在娱乐中保持健康心态，共同营造积极、负责任的娱乐环境。

            <div class="mt-5">
                乐天国际 —— 尊享皇家荣耀，体验非凡娱乐
                权威牌照 · 顶级平台 · 安全保障 · 公平公正 · 乐趣无限
                加入乐天国际，尊享王者体验，感受真正的国际级娱乐魅力！
            </div>
        </div>

        <div v-if="common.getParamsLang() == 'en'">
            <div class="font-bold text-black">Royal Entertainment - A Direct Brand of the Tenglong Group, the Most
                Powerful Platform in Asia.</div>

            <div class="font-bold text-black mt-5">Brand Reputation:</div>
            Royal Entertainment is a platform directly operated under the Tenglong Group, holding legal gaming licenses
            in Myanmar, the Philippines, Cambodia, Vietnam, and other countries. With the strong backing of the group
            and years of industry experience, Royal Entertainment adheres to the business principles of "Fairness,
            Integrity, Safety, and Innovation," striving to create the most trustworthy online entertainment brand
            worldwide.
            The platform employs internationally leading encryption technology and security systems, with multiple data
            verification and authoritative certifications to ensure absolute safety and privacy protection for all
            member information and transaction data. Thanks to its excellent reputation and stable operations, Royal
            Entertainment has earned widespread praise from players around the globe, making it a trusted first-choice
            brand.

            <div class="font-bold text-black mt-5">Integrity First:</div>
            Standing by integrity, thriving through reputation.
            Royal Entertainment firmly believes that credibility is the lifeblood of a brand. We promise to provide
            every player with the fairest, most transparent, and safest gaming experience. All game results are
            monitored in real-time by internationally authoritative organizations, ensuring fairness, transparency, and
            openness.
            We use globally leading gaming systems that are smooth, visually refined, and require no downloads,
            compatible across multiple devices. You can enjoy seamless entertainment anytime, anywhere.

            <div class="font-bold text-black mt-5">Diverse Games · Unlimited Fun</div>
            Royal Entertainment brings together top global gaming platforms, including:
            Live Casino: Interact in real-time with attractive dealers and experience the most authentic casino
            atmosphere. Popular games include live baccarat, dragon-tiger, roulette, sic bo, and more.
            Sports Betting: Covering thousands of global sports events with real-time odds, fairness, and transparency,
            letting you enjoy the thrill of the game.
            Electronic Games: Featuring hundreds of popular slot machines and arcade games, easy to play and full of
            fun.
            With rich game content, stunning visuals, and a fair winning mechanism, Royal Entertainment provides a true
            entertainment feast.

            <div class="font-bold text-black mt-5">Network Security & Privacy Protection:</div>
            To protect user privacy and transaction security, Royal Entertainment adopts "International Bank-Level SSL
            128-bit encryption technology," monitored and audited by multiple international security agencies to ensure
            every deposit and withdrawal is safe and worry-free.
            All member data is secured with multiple layers of protection and encryption, strictly following data
            protection regulations to safeguard player privacy.

            <div class="font-bold text-black mt-5">Customer Service · Professional & Attentive</div>
            Upholding the principle of "Customer First, Service Priority," Royal Entertainment has assembled a
            professional international customer service team available 24/7, 365 days a year, providing:

            <ol class="list-decimal list-inside space-y-1 my-3">
                <li>Fast and secure deposits and withdrawals</li>
                <li>Multilingual customer support with real-time interaction</li>
                <li>Regular promotions and exclusive rewards</li>
                <li>Immediate response to member suggestions and feedback</li>
            </ol>

            No matter where you are, Royal Entertainment provides a warm and welcoming service experience.

            <div class="font-bold text-black mt-5">Social Responsibility · Giving Back</div>
            Royal Entertainment is fully aware of its social responsibility and actively participates in charitable and
            social welfare initiatives across countries, demonstrating corporate commitment and contributing to
            community development and charity.

            Responsible Gaming
            Royal Entertainment promotes responsible gaming and strictly opposes gambling by minors.
            We encourage players to set reasonable budgets and play within their means, maintaining a healthy mindset
            while enjoying entertainment and collectively fostering a positive and responsible gaming environment.

            <div class="mt-5">
                Royal Entertainment — Experience Royal Prestige, Enjoy Extraordinary Entertainment
                Authoritative Licenses · Top Platform · Security Guaranteed · Fairness & Transparency · Infinite Fun
                Join Royal Entertainment to enjoy a kingly experience and feel the true charm of international-level
                entertainment!
            </div>
        </div>

        <div v-if="common.getParamsLang() == 'portugal'">
            <div class="font-bold text-black">Royal Entertainment - Marca Direta do Grupo Tenglong, a Plataforma Mais Poderosa da Ásia.</div>

            <div class="font-bold text-black mt-5">Reputação da Marca:</div>
            Royal Entertainment é uma plataforma operada diretamente pelo Grupo Tenglong, possuindo licenças legais de jogos em Mianmar, Filipinas, Camboja, Vietnã e outros países. Com o forte respaldo do grupo e anos de experiência no setor, Royal Entertainment segue os princípios de negócios de "Justiça, Integridade, Segurança e Inovação", esforçando-se para criar a marca de entretenimento online mais confiável do mundo.
            A plataforma utiliza tecnologia de criptografia e sistemas de segurança líderes internacionais, com múltiplas verificações de dados e certificações de instituições autorizadas, garantindo a absoluta segurança e proteção da privacidade de todas as informações e transações dos membros. Graças à sua excelente reputação e operação estável, Royal Entertainment conquistou elogios de jogadores em todo o mundo, tornando-se a marca de confiança número um.

            <div class="font-bold text-black mt-5">Integridade em Primeiro Lugar:</div>
            Baseada na integridade, prosperando através da reputação.
            Royal Entertainment acredita firmemente que a credibilidade é a essência de uma marca. Prometemos fornecer a cada jogador a experiência de jogo mais justa, transparente e segura. Todos os resultados dos jogos são monitorados em tempo real por organizações internacionais autorizadas, garantindo justiça, transparência e imparcialidade.
            Utilizamos sistemas de jogos líderes globais, com operação fluida, gráficos refinados e sem necessidade de download, compatíveis com múltiplos dispositivos. Você pode desfrutar de entretenimento a qualquer hora e em qualquer lugar.

            <div class="font-bold text-black mt-5">Jogos Diversificados · Diversão Sem Limites</div>
            Royal Entertainment reúne as melhores plataformas de jogos do mundo, incluindo:
            Cassino ao Vivo: Interaja em tempo real com dealers atraentes e experimente a atmosfera mais autêntica de cassino. Jogos populares incluem baccarat ao vivo, dragão-tigre, roleta, sic bo, entre outros.
            Apostas Esportivas: Abrangendo milhares de eventos esportivos globais com odds em tempo real, justos e transparentes, permitindo aproveitar a emoção das competições.
            Jogos Eletrônicos: Com centenas de slots populares e jogos de arcade, fáceis de jogar e extremamente divertidos.
            Com conteúdo de jogo diversificado, experiência visual incrível e mecanismo de premiação justo, Royal Entertainment proporciona um verdadeiro banquete de entretenimento.

            <div class="font-bold text-black mt-5">Segurança da Rede e Proteção da Privacidade:</div>
            Para proteger a privacidade dos usuários e a segurança das transações, Royal Entertainment adota "Tecnologia de Criptografia SSL 128 bits em nível bancário internacional", monitorada e auditada por diversas agências de segurança internacionais para garantir que cada depósito e saque seja seguro e sem preocupações.
            Todos os dados dos membros são protegidos com múltiplas camadas de segurança e criptografia, seguindo rigorosamente as regulamentações de proteção de dados, garantindo a privacidade dos jogadores.

            <div class="font-bold text-black mt-5">Atendimento ao Cliente · Profissional e Atencioso</div>
            Seguindo o princípio "Cliente em Primeiro Lugar, Prioridade no Serviço", Royal Entertainment montou uma equipe profissional de atendimento internacional, disponível 24/7, 365 dias por ano, oferecendo:

        <ol class="list-decimal list-inside space-y-1 my-3">
                <li>Processamento rápido e seguro de depósitos e saques</li>
                <li>Suporte ao cliente multilíngue com interação em tempo real</li>
                <li>Promoções regulares e recompensas exclusivas</li>
                <li>Resposta imediata a sugestões e feedbacks dos membros</li>
            </ol>

            Não importa onde você esteja, Royal Entertainment oferece uma experiência de serviço acolhedora.

        <div class="font-bold text-black mt-5">Responsabilidade Social · Retribuindo à Comunidade</div>
            Royal Entertainment está plenamente ciente de sua responsabilidade social e participa ativamente de iniciativas de caridade e bem-estar social em diversos países, demonstrando compromisso corporativo e contribuindo para o desenvolvimento comunitário e projetos de caridade.

            Jogos Responsáveis
            Royal Entertainment promove o jogo responsável e se opõe estritamente à prática de jogos por menores de idade.
            Incentivamos os jogadores a estabelecer orçamentos razoáveis e jogar dentro de seus limites, mantendo uma mentalidade saudável enquanto se divertem, contribuindo para um ambiente de entretenimento positivo e responsável.

            <div class="mt-5">
            Royal Entertainment — Experimente o Prestígio Real, Aproveite Entretenimento Extraordinário
            Licenças Autoritárias · Plataforma Top · Segurança Garantida · Justiça e Transparência · Diversão Infinita
            Junte-se à Royal Entertainment para desfrutar de uma experiência de rei e sentir o verdadeiro charme do entretenimento de nível internacional!
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import common from "@/utils/common/common";
</script>