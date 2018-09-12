import * as axios from "axios";

const ls = require('local-storage');


export default class SaveRugApi {
    static SaveRug(
        rug_type,
        cm_sku,
        cm_product_name,
        cm_product_id,
        bm1_sku,
        bm1_product_name,
        bm1_product_id,
        bm2_sku,
        bm2_product_name,
        bm2_product_id,
        piping_sku,
        piping_product_name,
        piping_product_id,
        width,
        height,
        preview_image
    ) {

        const form = new FormData();
        form.append("rug_type", rug_type);
        form.append("cm_sku", cm_sku);
        form.append("cm_product_name", cm_product_name);
        form.append("cm_product_id", cm_product_id);
        form.append("bm1_sku", bm1_sku);
        form.append("bm1_product_name", bm1_product_name);
        form.append("bm1_product_id", bm1_product_id);
        form.append("bm2_sku", bm2_sku);
        form.append("bm2_product_name", bm2_product_name);
        form.append("bm2_product_id", bm2_product_id);
        form.append("piping_sku", piping_sku);
        form.append("piping_product_name", piping_product_name);
        form.append("piping_product_id", piping_product_id);
        form.append("width", width);
        form.append("height", height);
        form.append("preview_image", preview_image);


        return axios({
            method: 'POST',
            url: process.env.REACT_APP_SAVE_RUG_ROOT,
            headers: {authorization: `Bearer ${ls('curUser').token}`},
            data: form
        })
            .then(response => {
                return response.data;
            })
    }
}