import axios from 'axios';

export const threekitService = async (method = 'get', url, headers = '', body = '') => {
    var config = {
        method: method,
        url: url,
        headers: headers,
        body: body
    }

    return axios(config)
        .then((res) => {
            return res.data;
        }).catch((error) => {
            return false;
        });
};


export const pricebookService = async (orgId, token, method = 'get', headers = '', body = '') => {
    var config = {
        method: method,
        url: `https://preview.threekit.com/api/orgs/${orgId}/pricebooks?all=true&bearer_token=${token}`,
        headers: headers,
        body: body
    }

    return axios(config)
        .then((res) => {
            return res.data;
        }).catch((error) => {
            return false;
        });
};

export const getCatalogInfo = async (orgId, assetId, token, method = 'get', headers = '', body = '') => {

    var config = {
        method: method,
        url: `https://preview.threekit.com/api/assets/${assetId}?orgId=${orgId}&bearer_token=${token}`,
        headers: headers,
        body: body
    }

    return axios(config)
        .then((res) => {
            return res.data;
        }).catch((error) => {
            return false;
        });
};

export const saveConfiguration = async (token, method = 'post', headers = '', body = '') => {

    body = {
        "orgId": "8d58cad8-dbf1-4270-b552-c0f637c8171d",
        "productId": "863a6ab8-c839-4163-acc3-58e8e2d13d73",
        "productVersion": "0001",
        "variant": {
            "Sabrina Mesh Back": "5636abb8-77fa-48e1-b73f-71f48a24693b",
            "Fabric Brand": "965a492c-786a-4ad6-b8fb-8d4d8e5c6c3d",
            "Interstice": "251c9647-30df-40b5-ada8-75b302dfa5af",
            "Fabric Pattern": "774f86aa-4169-46d3-a031-67cf00f5858e"
        },
        "metadata": {

        },

    }

    var config = {
        method: method,
        url: `https://preview.threekit.com/api/configurations?bearer_token=${token}`,
        headers: { 'Content-Type': 'application/json' },
        body: body
    }

    return axios(config)
        .then((res) => {
            console.log('saveConfiguration res =>', res);
            return res.data;
        }).catch((error) => {
            console.log('saveConfiguration res =>', error);
            return false;
        });
};


export const getConfiguration = (configId, token) => {
    const config = {
        method: 'get',
        url: `https://preview.threekit.com/api/configurations/${configId}?bearer_token=${token}`,
    };

    return axios(config)
        .then((res) => {
            // console.log('getConfiguration res =>', res);
            return res.data;
        }).catch((error) => {
            console.log('getConfiguration res =>', error);
            return false;
        });
};

export const getDataTableRows = async (tableId, token) => {
    const config = {
        method: 'get',
        url: `https://preview.threekit.com/api/datatables/${tableId}/rows?all=true&bearer_token=${token}`,
    };

    return axios(config)
        .then((response) => {
            // console.log('getDataTableRows res =>', response.data.rows);
            return response.data.rows
        }).catch((error) => {
            // console.log('getDataTableRows error =>', error);
            console.log(error);
        });
};

export const getAsset = (assetId, orgId, token) => {
    const config = {
        method: 'get',
        url: `https://preview.threekit.com/api/assets/${assetId}?orgId=${orgId}&bearer_token=${token}`,
    };

    return axios(config)
        .then((response) => response.data)
        .catch((error) => {
            console.log(error);
        });
};


export const createOrder = async (token, configId, orgId) => {

    var config = {
        method: 'post',
        url: `https://preview.threekit.com/api/orders?bearer_token=${token}`,
        headers: { 'Content-Type': 'application/json' },
        data: {
            "name": "sif Download",
            "originOrgId": "",
            "platform": {
                "id": "",
                "platform": "",
                "storeName": ""
            },
            "metadata": {},
            "items": [
                {
                    "id": configId,
                    "count": 1
                }
            ],
            "derivative": {},
            "status": "List",
            "orgId": orgId
        }
    }

    return axios(config)
        .then((res) => {
            console.log('saveOrder res =>', res);
            return res.data;
        }).catch((error) => {
            console.log('saveOrder res =>', error);
            return false;
        });
};

export const saveConfigurationSIF = async (token, orgId, productId, variant) => {

    var config = {
        method: 'post',
        url: `https://preview.threekit.com/api/configurations?bearer_token=${token}`,
        headers: { 'content-type': 'application/json' },
        data: {
            "orgId": orgId,
            "productId": productId,
            "productVersion": "v1",
            "variant": variant,
            "metadata": {

            },

        }
    }

    return axios(config)
        .then((res) => {
            console.log('saveConfigurationSIF res =>', res);
            return res.data;
        }).catch((error) => {
            console.log('saveConfigurationSIF res =>', error);
            return false;
        });
};


