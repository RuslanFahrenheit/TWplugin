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

    function requiredOptionsException(obj) {
        for (let key in obj) {
            if (typeof obj[key] === 'object') {
                requiredOptionsException(obj[key]);
            } else if (obj[key] === 'undefined') {
                throw new Error(`${key} is required.`);
            }
        }
    }

    function processTemplate(context, renderer, cb) {
        context.wrapInner(renderer);
        cb();
    }

    $.fn.timeTW = function(options) {
        const config = $.extend(true, {}, $.fn.timeTW.defaults, options),
        context = this;

        requiredOptionsException(config);

        return this.each(() => {
            getTWInfo(config.ajaxAPI.url, config)
                .then(
                    data => processTemplate(context, config.renderTemplate(config.template, data['user']), config. afterRenderCb),
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
        renderTemplate: (template, data) => {
            const templateVariableRegExp = /{{(.*?)}}/i;
            let result;

            while (result = templateVariableRegExp.exec(template)) {
                template = template.replace(result[0], data[result[1]]);
            }
            return template;
        },
        afterRenderCb: () => {}
    }
})(jQuery);