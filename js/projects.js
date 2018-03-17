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

    $.fn.projectsTW = function(options) {
        const config = $.extend(true, {}, $.fn.projectsTW.defaults, options);

        requiredOptionsException(config);

        return this.each(() => {
            getTWInfo(config.ajaxAPI.url, config)
                .then(
                    data => this.wrapInner(processTemplate(config.template, data['projects'][0])),
                    error => console.log(`Error: ${error}`)
                );
        });
    };

    $.fn.projectsTW.defaults = {
        template: `
            <p>{{id}} {{name}} {{status}} {{created-on}} {last-changed-on}} {{description}}</p>
        `,
        ajaxAPI: {
            method: 'GET',
            url: 'undefined',
            token: 'undefined',
            error: (error)=> {
                console.log(`Rejected: ${error}`);
            }
        }
    }
})(jQuery);