const getHeaderCookie = (p:any) => {
    let cookieArr = p ? p.replace(/\s/g, "").split(";") : [];
    let obj = {}
    cookieArr.forEach((i) => {
        let arr = i.split("=");
        obj[arr[0]] = arr[1];
    });
    return obj
}
export  {
    getHeaderCookie
}
