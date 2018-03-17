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

    $.fn.userTW = function(options) {
        const config = $.extend(true, {}, $.fn.userTW.defaults, options);

        return this.each(() => {
            getTWInfo(config.ajaxAPI.url, config)
                .then (
                    data => this.wrapInner(processTemplate(config.template, data.person)),
                    error => config.ajaxAPI.error(error)
                );
        });
    };

    $.fn.userTW.defaults = {
        template: `
                <div class="tw-user">
                    User name: {{first-name}} {{last-name}} {{first-name}} {{first-name}} {{last-name}}
                </div>
            `,
        ajaxAPI: {
            method: 'GET',
            url: '',
            token: '',
            error: (error)=> {
                console.log(`Rejected: ${error}`);
            }
        }
    }

})(jQuery);