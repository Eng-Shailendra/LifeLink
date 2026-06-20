const wrapAsync = (fn) => {
    return (req, res, next) => {
        try {
            fn((req, res, next))
        } catch (err) {
            next
        }
    }
}

export default wrapAsync;