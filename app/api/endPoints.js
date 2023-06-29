const baseUrl = "https://api.ohmytrash.co"
// const baseUrl = "http://192.168.1.3:3000"
// const baseUrl = "http://localhost:3000"

const one_signal_id = "24076781-f30d-4725-9e06-d5d8aaf9563a";

//user
const user = baseUrl + "/users";
const refresh_token = user + "/refresh_token";
const log_in = user + "/log_in";
const log_in_by_social = user + "/log_in_by_social";
const log_in_by_phone_verification = user + "/log_in_by_phone_verification";
const user_info = user + "/:id";

//junk shop
const junk_shop = baseUrl + "/junkshops";
const pending_junk_shop = junk_shop + "/pending";
const approved_junk_shop = junk_shop + "/approved";
const rejected_junk_shop = junk_shop + "/rejected";
const added_junk_shop = junk_shop + "/added/";


//news
const news = baseUrl + "/news";
const pending_news = baseUrl + "/news/pending";

//item
const item = baseUrl + "/item";
const pending_item = baseUrl + "/item/pending";

//notification
const notification = junk_shop + '/notification';

// wallet
const wallet = baseUrl + '/wallets';

//contact
const contact = baseUrl + '/contact';

//market place
const market_place = baseUrl + "/market_place";
const dashboard_market_place = baseUrl + "/market_place/dashboard";
const save_product = market_place + '/saved_product';
const upload_product = market_place + '/uploaded_product';
const order_product = market_place + '/ordered_product';
const order_accepted_product = market_place + '/ordered_product/accepted';
const discuss_product = market_place + '/discussed_product';
const my_product_ordered = market_place + '/ordered_product/my_product';
const my_product_ordered_accepted = market_place + '/ordered_product/my_product/accepted';
const market_place_notification = market_place + '/notification';

//socket
const message_socket = baseUrl + '/discussed_product';
const notification_socket = baseUrl + '/market_place_notification'; // all notification


export {
    one_signal_id,
    refresh_token,
    user,
    log_in,
    log_in_by_social,
    log_in_by_phone_verification,
    junk_shop,
    pending_junk_shop,
    approved_junk_shop,
    rejected_junk_shop,
    added_junk_shop,
    user_info,
    item,
    news,
    pending_item,
    pending_news,
    notification,
    contact,
    market_place,
    dashboard_market_place,
    save_product,
    upload_product,
    order_product,
    order_accepted_product,
    discuss_product,
    my_product_ordered,
    my_product_ordered_accepted,
    market_place_notification,
    message_socket,
    notification_socket,
    wallet,
}
