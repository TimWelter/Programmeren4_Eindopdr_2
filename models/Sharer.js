class Sharer {
    constructor(userId, categoryId, spullenId) {
        this.userId = userId
        this.categoryId = categoryId
        this.spullenId = spullenId
    }

    getUserId() {
        return this.userId
    }

    getCategoryId() {
        return this.categoryId
    }

    getSpullenId() {
        return this.spullenId
    }
}