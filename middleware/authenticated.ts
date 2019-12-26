import Vue from "vue";
export default function ({ app, req, route, redirect,store}) {
    //获取网页开始加载的时间戳
    let startTime = Date.now();
    // store.commit('SET_LOAD_START_TIME', startTime);
    const hasToken = !!app.$apolloHelpers.getToken()
    const routeName = store.state.noTokenPage
    let hasNotAuth = false
    // routeName
    if (route.name){
        // for (let item of routeName) {
        //     if (route.name.indexOf(item) !== -1) {
        //         hasNotAuth = true
        //         return
        //     }
        // }

        // if (!hasToken && !hasNotAuth) {
        //     const url = app.$getRedirectPath()
        //     redirect(url)
        // }
    }

}
