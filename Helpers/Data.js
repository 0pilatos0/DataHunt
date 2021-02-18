export function setDataWindow(name, value){
    window[name] = value
}

export function getDataWindow(name){
    return window[name]
}

export function deleteDataWindow(name){
    window.splice(window.indexOf(name), 1)
}

export function setDataSocket(name, value){
    window.socket[name] = value
}

export function getDataSocket(name){
    return window.socket[name]
}

export function deleteDataSocket(name){
    window.socket.splice(window.socket.indexOf(name), 1)
}

export function setDataCookie(name, value){
    let d = new Date()
    d.setTime(d.getTime() + 30 * 24 * 60 * 60 * 1000)
    let expires = `expires=${d.toUTCString()}`
    document.cookie = `${name}=${value};${expires};`
}

export function deleteDataCookie(name){
    let d = new Date()
    d.setTime(d.getTime() + 0 * 24 * 60 * 60 * 1000)
    let expires = `expires=${d.toUTCString()}`
    let cookies = document.cookie.split(';')
    for (let i = 0; i < cookies.length; i++) {
        if(cookies[i].includes(name))
        document.cookie = `${name}=${cookies[i].replace(`${name}=`, "")};${expires};` 
    }
}

export function getDataCookie(name){
    let cookies = document.cookie.split(';')
    for (let i = 0; i < cookies.length; i++) {
        if(cookies[i].includes(name))
            return cookies[i].replace(`${name}=`, "")
    }
}