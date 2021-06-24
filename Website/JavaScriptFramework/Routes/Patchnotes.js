const Route = require("../Classes/Route");
const PatchnotesController = require("../Controllers/PatchnotesController");

module.exports = class Patchnotes extends Route{
    constructor() {
        super('')

        this.get('/patchnotes', PatchnotesController.HandlePatchnotes)

        this.post('/patchnotes', PatchnotesController.HandlePatchnotesPost)

        this.get('/editPatchnote', PatchnotesController.HandleEditPatchnote)

        this.post('/editPatchnote', PatchnotesController.HandleEditPatchnotePost)
    }
}