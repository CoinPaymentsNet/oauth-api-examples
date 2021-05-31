export class WebhooksList extends HTMLElement {
    webhooks_list_wrap = {"query": "#webhooks-list-wrap", "target": HTMLElement};
    webhooks_list_body = {"query": "#webhooks-list-body", "target": HTMLElement};
    show_webhooks_list_button = {"query": "#show-webhooks-list-button", "target": HTMLElement};
    webhooks_list_item = {"query": "#webhooks-list-item"};
    webhook_id_cell = {"query": "div[type=\"webhook-id-cell\"]"};
    notifications_url_cell = {"query": "div[type=\"notifications-url-cell\"]"};
    notifications_cell = {"query": "div[type=\"notifications-cell\"]"};
    client_params = {"query": "client-params-block"};

    /**
     * Create a new instance of
     */
    constructor() {
        super();
    }

    async connectedCallback() {
        const response = await fetch("./js/webhooksList/webhooksList.html");
        this.innerHTML = await response.text();

        this.querySelector(this.show_webhooks_list_button.query).addEventListener("click", () => this.getWebhooksList());

        this.webhooks_list_wrap.target = this.querySelector(this.webhooks_list_wrap.query)
        this.webhooks_list_wrap.target.style.display = "none";
    }

    setRequest(request) {
        this.request = request
    }

    async getWebhooksList() {
        try {
            let client_id = document.querySelector(this.client_params.query).getClientId()
            let custom_elem = this;
            await this.request.get("/api/v1/merchant/clients/" + client_id + "/webhooks").then((response) => {
                custom_elem.webhooks_list_body.target = custom_elem.webhooks_list_wrap.target.querySelector(custom_elem.webhooks_list_body.query);
                if (!custom_elem.item_template) {
                    custom_elem.item_template = custom_elem.querySelector(custom_elem.webhooks_list_item.query).cloneNode(true);
                }

                custom_elem.webhooks_list_body.target.innerHTML = "";

                if (response.status >= 200 && response.status < 300) {
                    response.data = JSON.parse(response.data);
                    if (response.data.items.length) {
                        custom_elem.webhooks_list_wrap.target.style.display = "block";

                        response.data.items.forEach(function (item) {
                            let itemRow = custom_elem.item_template.content.cloneNode(true);
                            itemRow.querySelector(custom_elem.webhook_id_cell.query).innerText = item.id
                            itemRow.querySelector(custom_elem.notifications_url_cell.query).innerText = item.notificationsUrl
                            itemRow.querySelector(custom_elem.notifications_cell.query).innerHTML = ""
                            item.notifications.forEach((notification) => {
                                itemRow.querySelector(custom_elem.notifications_cell.query).append(notification)
                                itemRow.querySelector(custom_elem.notifications_cell.query).append(document.createElement("br"))
                            });
                            custom_elem.webhooks_list_body.target.appendChild(itemRow);
                        })
                    } else {
                        custom_elem.webhooks_list_wrap.target.style.display = "none";
                    }
                } else {
                    if (response.status >= 400 && response.status < 500) {
                        response.data = JSON.parse(response.data);
                        throw new Error(response.data.detail);
                    }
                    throw new Error(response.statusText);
                }
            })
        } catch (e) {
            alert(e)
        }
    }
}