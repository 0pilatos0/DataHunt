const Controller = require('../Classes/Controller')
const Feedback = require('../Helpers/Feedback')
const Modal = require('../Helpers/Modal')
const Patchnote = require('../Models/Patchnote')

module.exports = class PatchnotesController extends Controller{
    constructor(){
        super()
    }

    static async HandlePatchnotes(req, res){
        let patchnotes = await Patchnote.select({
            where: {
                deleted: 0
            },
            orderBy: 'ORDER BY id DESC'
        })
        let patchnotesHTML = ''
        let modalHTML = req.session.modal || ''
        delete req.session.modal
        let patchDate = new Date(patchnotes[0].date_created)
        let latestPatch = `<h1 style="display: inline;">${patchnotes[0]["title"]} - ${patchDate.getHours()}:${patchDate.getMinutes()}</h1>`
        if(req.session.userinfo && req.session.userinfo.role_id){
            latestPatch += `
            <div class="patchnotesButtons" id="${patchnotes[0]["id"]}">
                <i style="color: #50b64e" class="far fa-edit"></i>
                <i style="color: #fe0026;" class="fas fa-trash"></i>
            </div>`
        }
        latestPatch += `${patchnotes[0]["note"]}`
        patchnotes.shift()
        patchnotes.map(p => {
            let patchDate = new Date(p["date_created"])
            patchnotesHTML += `<button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample${patchnotes.indexOf(p)}" aria-expanded="false" aria-controls="collapseExample${patchnotes.indexOf(p)}"  style="display: inline;">
                ${p.title} - ${patchDate.getDate()}/${patchDate.getMonth() + 1}/${patchDate.getFullYear()} - ${patchDate.getHours()}:${patchDate.getMinutes()}
            </button>`;
            if (req.session.userinfo && req.session.userinfo["role_id"]) {
                patchnotesHTML += `
                    <div class="patchnotesButtons" id="${p["id"]}">
                        <i style="color: #50b64e" class="far fa-edit"></i>
                        <i style="color: #fe0026;" class="fas fa-trash"></i>
                    </div>`
            }
            patchnotesHTML += `<br>
                <div class="collapse" id="collapseExample${patchnotes.indexOf(p)}">
                    <h1>${p["title"]}</h1>
                    ${p["note"]}
                </div>`
        })
        res.render('patchnotes', {
            LATESTPATCH: latestPatch,
            PATCHNOTES: patchnotesHTML,
            MODAL: modalHTML
        })
    }

    static async HandlePatchnotesPost(req, res){
        if(req.data.edit){
            req.session.patchnoteId = req.data.edit
            res.redirect('/editPatchnote')
            return
        }
        
        if(req.data.delete){
            let patchnote = await Patchnote.find({
                where: {
                    id: req.data.delete
                }
            })
            new Modal({
                title: "Delete Patchnote",
                body: `<p>Are you sure you want to delete patchnote ${patchnote.title}?</p>`,
                confirm: `
                    <form method="post" style="display: inline-block;">
                        <input type="hidden" value="${req.data.delete}" name="deleteConfirm">
                        <button class="btn btn-primary" type="submit">Delete</button>
                    </form>`,
                session: req.session
            })
            res.redirect('/patchnotes')
            return
        }

        if(req.data.deleteConfirm){
            await Patchnote.update({
                data:{
                    deleted: 1
                },
                where:{
                    id: req.data.deleteConfirm,
                    deleted: 0
                }
            })
            let patchnote = await Patchnote.find({
                where:{
                    id: req.data.deleteConfirm
                }
            })
            new Feedback({
                type: 'success',
                message: `Deleted patch ${patchnote.title}`,
                session: req.session
            })
            res.redirect('/patchnotes')
            return
        }
    }

    static async HandleEditPatchnote(req, res){
        if(!req.session.userinfo){
            res.redirect('/')
            return
        }
        let patchnote = await Patchnote.find({
            where:{
                id: req.session.patchnoteId,
                deleted: 0
            }
        })
        res.render('editPatchnote', {
            TITLE: req.session.patchnoteTitle || patchnote.title,
            DATA: req.session.note !== "<p><br></p>" && req.session.note ? req.session.note : patchnote.note.toString()
        })
        delete req.session.patchnoteTitle
        delete req.session.note
    }

    static async HandleEditPatchnotePost(req, res){
        if(req.data.editorTitle !== "" && req.data.data !== "<p><br></p>"){
            await Patchnote.update({
                where:{
                    title: req.data.editorTitle,
                    note: req.data.data
                },
                data:{
                    id: req.session.patchnoteId
                }
            })
            delete req.session.patchnoteId
            res.redirect('/patchnotes')
            return
        }
        else if(req.data.editorTitle == ""){
            new Feedback({
                type: 'danger',
                message: "Could not edit patchnote, because title was empty",
                session: req.session
            })
            req.session.patchnoteTitle = req.data.editorTitle
            req.session.note = req.data.data
            res.redirect("/editPatchnote")
        }
        else if(req.data.data = "<p><br></p>"){
            new Feedback({
                type: 'danger',
                message: "Could not edit patchnote, because content was empty",
                session: req.session
            })
            req.session.patchnoteTitle = req.data.editorTitle
            req.session.note = req.data.data
            res.redirect("/editPatchnote")
        }
    }
}