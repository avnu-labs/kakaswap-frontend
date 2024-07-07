import type { TranslateState } from "../../context/TranslateProvider/model";

const frTranslate: TranslateState = {
  menu: {
    title: "Kakaswap",
    swap: "Échanger",
    pool: "Pools",
    strategies: "Stratégies",
    collections: "Collections",
  },

  whitelist: {
    title: "Bienvenu sur Kakaswap",
    introduction: "Nous sommes ravis de vous présenter notre première verticale: un one-click AMM revisité",
    explanation: "Cette file d'attente est là pour récolter et considérer l'ensemble de vos précieux feedbacks. ",
    register_beta: "S'enregistrer comme bêta-testeur",
    registration_inprogress: "Enregistrement en cours",
    loading: "Chargement",
    unavailable_slot: "Malheureusement toutes les places sont prises pour le moment.",
    dont_worry: "Pas de panique ! Nous augmentons régulièrement le nombre de places.",
    stay_tuned: "Restez connecté sur notre",
    stay_tuned_2: "pour ne rien rater.",
    congrats: "Félicitations",
    access_sentence: "Vous pouvez dès à présent vous enregistrer comme Bêta-testeur.",
    available_slots: "Places disponibles:",
    once_registered: "Une fois enregistré, vous pourrez accédez à Kakaswap avec la même addresse.",
    beta_registration: "Enregistrement à l'accès Bêta",
    mint_tokens: "Minter arfBTC",
    mint_eth: "Minter ETH",
  },

  common: {
    title: "Bienvenu ",
    wallet: "Portefeuille",
    add_to_watchlist: "Ajouter au portefeuille",
    approve: "Approuver",
    approving: "Approbation",
    direct: "direct",
    per: "par",
    for: "pour",
    against: "contre",
    no_account: "Pas de compte",
    pending: "en attente",
    connect_wallet: "Connecter le portefeuille",
    disconnect_wallet: "Se déconnecter",
    wallet_warning_title: "⚠️ Portefeuille",
    wallet_argent_x_extension_missing: "L'extension Argent-X est manquante",
    connected_with_argent_x: "Connecté avec ArgentX",
    copied: "Copié",
    copy_address: "Copier l'addresse",
    view_on_explorer: "Voir sur l'explorateur",
    your_transactions: "Vos transactions",
    your_transactions_will_appear_here: "Vos transactions apparaîtront ici\n",

    approving_token: "Approbation du token",
    not_enough: "Pas assez",
    balance: "balance",

    // Transactions infos
    transaction_rejected_by_user: "Transaction rejetée par l'utilisateur",
    transaction_transmitted: "Transaction transmise",
    transaction_received: "Transaction reçue",
    transaction_confirmed: "Transaction confirmée",
    transaction_rejected: "Transaction rejetée",

    // Testnet warning and info
    testnet_warning_main:
      "<li>" +
      "  Kakaswap est actuellement déployé en version beta sur le " +
      "  <b>" +
      "    <u>testnet</u>," +
      "  </b>" +
      "  de Kakarot, les transactions pourraient donc prendre jusqu'à " +
      "  <b>" +
      "    <u>10 minutes.</u>\n" +
      "  </b>" +
      "</li>",
    testnet_warning_contracts: "Sachez que les contrats peuvent être mis à jour à tout moment.",
    testnet_warning_have_fun: "Merci pour votre soutien et amusez-vous!",

    select_a_coin: "sélectionner un coin",
    choose_coin: "Choisissez un coin",
    token_name_or_address_placeholder: "Nom ou adresse du token",
    no_result: "Aucun résultat",
    manage_token_lists: "Gérer votre liste de token",
    from: "De",
    to: "À",
    coming_soon: "Bientôt disponible ✨",
    all_rights: "Tous droits réservés.",
    loading: "Chargement",
    links: "Liens",
    warning_price_updated: "⚠️ Confirmer le nouveau prix",
    add: "Ajouter",
    confirm: "Confirmer",
    migrate_assets: "Déplacer tous les assets",
    migrate_assets_infos: "Déplacez vos assets et synchronisez votre activité on-chain en une seule transaction",
    recipient: "Receveur",
    recipient_address: "Adresse de réception",
    error_address: "Veuillez saisir une adresse valide",
    sync_addr_text:
      "Cette action va également synchroniser on-chain votre adresse actuelle avec votre addresse de réception dans le but de garder une trace de votre activité",
    more: "plus d'infos...",
  },

  swap: {
    swap: "Échanger",
    confirm_swap: "Confirmer l'échange",

    // Quote infos
    waiting_quote: "En attente de l'estimation",
    quote_updated: "Estimation mise-à-jour",

    // Swap infos
    rate: "Taux",
    min_received: "Minimum reçu",
    price_impact: "Impact sur le prix",
    lp_fees: "Commission du fournisseur de liquidité",
    route: "Route",
  },

  pool: {
    price_disclaimer:
      "Veuillez noter que les prix des tokens ont été fixés à 0.419$ dans un but de test, ils n'ont aucune valeur sur le testnet",
    pools: "Pools",
    liquidity: "Liquidité",
    all_pools: "Toutes les pools",
    my_liquidity: "Ma liquidité",
    create_and: "Créer & ",
    add_liquidity: "Ajouter de la liquidité",
    confirm_add_liquidity: "Confirmer ajouter de la liquidité",
    pool_creation: "Création de la Pool",
    no_pool: "Aucune pool",
    warning_no_pool:
      "<b>Aucune pool</b> n'existe actuellement pour ces tokens, vous êtes sur le point\n" +
      "de créer cette pool et donc fournir en proportion <b>équivalente</b>\n" +
      "chaque token. Sinon, vous risquez de vous faire <b>arbitré</b> par\n" +
      "le marché",
    no_position: "Aucune position",
    please_connect: "Connectez votre portefeuille pour visualiser vos positions",
    pair: "Paire",
    amount: "Quantité",
    action: "Action",
    remove: "Retirer",
    show: "Afficher",
    hide: "Masquer",
    rank: "Rang",
    reserve_token_0: "Réserve token 0",
    reserve_token_1: "Réserve token 1",
    volume_24h: "Volume (24h)",
    fees_24h: "Frais (24h)",
    apr: "APR",
    pool_share: "Parts dans la pool",
    lp_received: "LP reçu",
    lp_send: "LP envoyé",
    slippage: "Glissement",

    // remove liquidity labels
    will_receive: "Vous recevrez au minimum",
    your_positions: "Votre position",
    pooled: "placé",
    remove_liquidity: "Retirer votre liquidité",
    confirm_remove_liquidity: "Confirm retirer votre liquidité",
    amount_remove: "Montant à retirer",
    add_more: "Ajouter plus",
  },
};

export default frTranslate;
