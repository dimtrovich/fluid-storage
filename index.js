/**!
 * Fluid Storage v0.1.0 (https://github.com/DimitriSitchet/fluid-storage)
 * Copyright 2021 Dimtrov Lab's | Dimitri Sitchet Tomkeu
 * Licensed under MIT (https://opensource.org/licences/mit)
 *
 * @author Dimitri Sitchet Tomkeu <devcode.dst@gmail.com>
 * @copyright Dimtrov Lab's | Dimitri Sitchet Tomkeu
 * @description Une interface de stockage structuré de données côté client simple et rapide
 * @version 0.1.0
 * @licence MIT
 */
(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
        (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.fluidStorage = {}));
}(this, (function(exports) {
    'use strict';

    /**
     * Initialisation du gestionnaire de stockage
     *
     * @param {String} prefixe prefixe a utiliser pour le nom des elements stockes
     * @param {String} type type de stockage a utiliser
     * @return {Stockage}
     */
    exports.init = function(prefixe, type) {
        return new Stockage(prefixe || 'fs', normalizeType(type))
    }

    function Stockage(p, t) {
        let prefixe = p,
            type = t

        /**
         * Recupere un element du store
         *
         * @param {String} key
         * @return {Object}
         */
        this.get = (key) => {
            key = prefixe + '.' + key.replace('/^' + prefixe + '\./', '')
            let data = null

            if (type === 'localstorage') {
                data = window.localStorage.getItem(key)
            }
            if (type === 'sessionstorage') {
                data = window.sessionStorage.getItem(key)
            }
            if (type === 'cookie') {
                data = getCookie(key)
            }

            if (empty(data)) {
                return null
            }
            data = JSON.parse(data)
            let expire = data.expire || 0

            if (type !== 'cookie' && expire > 0 && (new Date().getTime() >= expire)) {
                this.remove(key)
                return null
            }

            return data.value || data
        }

        /**
         * Ajoute un element en session
         *
         * @param {String} key
         * @param {*} value
         * @param {Integer} expire duree en minute de mise en session. Si non defini aucune limite n'est rajoutee
         */
        this.set = (key, value, expire) => {
            key = prefixe + '.' + key.replace('/^' + prefixe + '\./', '')
            expire = (!isNaN(parseInt(expire)) && isFinite(expire)) ? expire : 0

            value = JSON.parse(JSON.stringify(value))
            if (expire > 0) {
                expire = new Date().getTime() + (expire * 60 * 1000)
            }

            let data = JSON.stringify({ value, expire })

            if (type === 'localstorage') {
                window.localStorage.setItem(key, data)
            }
            if (type === 'sessionstorage') {
                window.sessionStorage.setItem(key, data)
            }
            if (type === 'cookie') {
                setCookie(key, data, expire)
            }
        }

        /**
         * Retire un element de la session
         *
         * @param {String} key
         */
        this.remove = (key) => {
            key = prefixe + '.' + key.replace(prefixe + '\.', '')
            if (type === 'localstorage') {
                window.localStorage.removeItem(key)
            }
            if (type === 'sessionstorage') {
                window.sessionStorage.removeItem(key)
            }
            if (type === 'cookie') {
                document.cookie = key + '=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';
            }
        }

        /**
         * Vide toutes las variable de session de l'application
         */
        this.clear = () => {
            const regex = new RegExp('^' + prefixe + '\.')
            let data = []

            if (type === 'localstorage') {
                data = window.localStorage
            }
            if (type === 'sessionstorage') {
                data = window.sessionStorage
            }
            if (type === 'cookie') {
                data = getCookies()
            }

            for (let key in data) {
                if (regex.test(key)) {
                    this.remove(key)
                }
            }
        }

    }


    /**
     * Normalise le type de stockage a utiliser
     *
     * @param {String} type
     * @return {String}
     */
    const normalizeType = (type) => {
        if (type && typeof type == 'string') {
            type = type.toLowerCase()
        }
        if (['localstorage', 'sessionstorage', 'cookie'].indexOf(type) == -1) {
            type = 'localstorage'
        }
        return type
    }

    /**
     * Defini un cookie
     *
     * @param {String} name
     * @param {String} value
     * @param {Integer} expire
     */
    const setCookie = (name, value, expire) => {
        let expireDate = ''
        if (expire > 0) {
            expireDate = '; expires=' + (new Date(Date.now() + (expire * 60 * 24))).toUTCString()
        }
        document.cookie = name + "=" + value + expireDate
    }

    /**
     * Recupere la valeur d'un cookie donné
     *
     * @param {String} name
     * @return {*}
     */
    const getCookie = (name) => {
        const cookies = getCookies()

        return cookies[name] || null
    }

    /**
     * Renvoi la liste de tous les cookies
     *
     * @returns {Array}
     */
    const getCookies = () => {
        let cookiesArr = document.cookie.split(';'),
            cookies = []

        cookiesArr.forEach(elt => {
            let c = elt.split('=')
            cookies[c[0]] = c[1] || null
        })

        return cookies
    }

    /**
     * FONCTIONS UTILITAIRES
     */
    /**
     *
     * @param {*} el
     * @return {Boolean}
     */
    const empty = (el) => {
        if (typeof el === 'undefined' || el === null) {
            return true
        }
        if ((typeof el === 'string' || el instanceof String) && el === '') {
            return true
        }
        if ((Array.isArray(el) || el instanceof Array) && !el.length) {
            return true
        }
        if ((typeof el === 'object' || el instanceof Object) && el.constructor === Object && !Object.keys(el).length) {
            return true
        }
        return false
    }
})))
