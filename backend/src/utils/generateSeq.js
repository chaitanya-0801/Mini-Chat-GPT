import generateUniqueId from 'generate-unique-id'

const generateUniqueSeq =  () => {
    try {
        const seq =  generateUniqueId()
        return seq;
    } catch (error) {
        throw error
    }
}

export default generateUniqueSeq