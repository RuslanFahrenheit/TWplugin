;(($) => {
    'use strict';

    const getTWInfo = (url, config) => {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: config.ajaxAPI.method,
                url: config.ajaxAPI.url,
                headers: {'Authorization': 'BASIC ' + window.btoa(config.ajaxAPI.token + ':xxx')}
            })
                .done((data) => {
                    resolve(data);
                })
                .fail((data, error) => {
                    reject(error);
                });
        });
    };

    const processTemplate = (template, data) => {
        const templateVariableRegExp = /{{(.*?)}}/i;
        let result;

        while (result = templateVariableRegExp.exec(template)) {
            template = template.replace(result[0], data[result[1]]);
        }
        return template;
    }

    function requiredOptionsException(obj) {
        for (let key in obj) {
            if (typeof obj[key] === 'object') {
                requiredOptionsException(obj[key]);
            } else if (obj[key] === 'undefined') {
                throw new Error(`${key} is required.`);
            }
        }
    }

    $.fn.timeTW = function(options) {
        const config = $.extend(true, {}, $.fn.timeTW.defaults, options);

        requiredOptionsException(config);

        return this.each(() => {
            getTWInfo(config.ajaxAPI.url, config)
                .then(
                    data => this.wrapInner(config.templater(config.template, data['user'])),
                    error => console.log(`Error: ${error}`)
                );
        });
    };

    $.fn.timeTW.defaults = {
        template: `
            <p>Empty</p>
        `,
        ajaxAPI: {
            method: 'GET',
            url: 'undefined',
            token: 'undefined',
            error: (error)=> {
                console.log(`Rejected: ${error}`);
            }
        },
        templater: (template, data) => {
            processTemplate(template, data);
        }
    }
})(jQuery);