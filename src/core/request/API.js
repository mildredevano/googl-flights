const get = async(url, qsp = {}) => {
    return new Promise(resolve => {
        // SET REQUEST
        let subqsp = []
        Object.keys(qsp).map(k => subqsp.push(`${k}=${qsp[k]}`));
        qsp = `${subqsp.join('&')}`

        // SET PARAMETERS
        let params = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '5df642e534mshdd73a99359a0d13p1845e8jsn4b6b00a51c2f',
                'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com'
            },
            redirect: 'follow'
        };

        // SEND REQUEST
        fetch(`${url}?${qsp}`, params).then(result => {
            return resolve(result.json())
        }).catch(error => console.log('error', error));
    })
}

export const rqx = { get }