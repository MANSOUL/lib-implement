class P {
    constructor(callback) {
        this.status = 'pending'
        this.resolveCallbacks = []
        this.rejectCallbacks = []
        const resolve = data => {
            this.status = 'fullfilled'
            this.data = data
            if (data instanceof P) {
                return data.then(resolve, reject)
            }
            setTimeout(() => {
                for (let i = 0; i < this.resolveCallbacks.length; i++) {
                    this.resolveCallbacks[i](data)
                }
            })
        }
        const reject = reason => {
            this.status = 'rejected'
            this.reason = reason
            if (reason instanceof P) {
                return reason.then(resolve, reject)
            }
            setTimeout(() => {
                for (let i = 0; i < this.rejectCallbacks.length; i++) {
                    this.rejectCallbacks[i](reason)
                }
            })
        }
        try {
            callback(resolve, reject)
        } catch (error) {
            reject(error)
        }
    }

    then(resolve, reject) {
        let p = null
        resolve = typeof resolve === 'function' ? resolve : data => data
        reject = typeof reject === 'function' ? reject : data => data

        if (this.status === 'fullfilled') {
            p = new P((p_resolve, p_reject) => {
                setTimeout(() => {
                    try {
                        const result = resolve(this.reason)
                        if (result instanceof P) {
                            result.then(p_resolve, p_reject)
                        } else {
                            p_resolve(result)
                        }
                    } catch (error) {
                        p_reject(error)
                    }
                })
            })
        }

        if (this.status === 'rejected') {
            p = new P((p_resolve, p_reject) => {
                setTimeout(() => {
                    try {
                        const result = reject(this.reason)
                        if (result instanceof P) {
                            result.then(p_resolve, p_reject)
                        } else {
                            p_reject(result)
                        }
                    } catch (error) {
                        p_reject(error)
                    }
                })
            })
        }

        if (this.status === 'pending') {
            p = new P((p_resolve, p_reject) => {
                this.resolveCallbacks.push(data => {
                    try {
                        const result = resolve(data)
                        if (result instanceof P) {
                            result.then(p_resolve, p_reject)
                        } else {
                            p_resolve(result)
                        }
                    } catch (error) {
                        p_reject(error)
                    }
                })

                this.rejectCallbacks.push(reason => {
                    try {
                        const result = reject(reason)
                        if (result instanceof P) {
                            result.then(p_resolve, p_reject)
                        } else {
                            p_reject(result)
                        }
                    } catch (error) {
                        p_reject(error)
                    }
                })
            })
        }

        return p
    }

    catch(reject) {
        return this.then(null, reject)
    }

    finally(cb) {
        return this.then(cb, cb)
    }
}
