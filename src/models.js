module.exports = {
    templateTable: {
        index: (header, body) => {
            return {header, body};
        },
        table: (headerRows, bodyRows, caption = null) => {
            return {
                caption,
                headerRows: [...headerRows],
                bodyRows: [...bodyRows]
            };
        },
        element: (value, attributes = []) => {
            return {value, attributes: [...attributes]};
        }
    }
}
