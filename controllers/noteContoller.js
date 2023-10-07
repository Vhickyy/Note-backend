const getAllNotes = async (req,res) => {
    res.send("get all")
}
const addNote = async (req,res) => {
    res.send("add")
}
const getSingleNote = async (req,res) => {
    res.send("get one")
}
const updateNote = async (req,res) => {
    res.send("update")
}
const deleteNote = async (req,res) => {
    res.send("delete")
}
export {getAllNotes, addNote, getSingleNote, updateNote, deleteNote};