"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// changer les require par des import
const express_1 = __importDefault(require("express"));
const utils_1 = __importDefault(require("./utils"));
const cors_1 = __importDefault(require("cors"));
const wilders_1 = __importDefault(require("./controllers/wilders"));
const skills_1 = __importDefault(require("./controllers/skills"));
const upvotes_1 = __importDefault(require("./controllers/upvotes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const asyncHandler = (controller) => {
    return async (req, res) => {
        console.log("I'm executing a controller by asyncHandler !");
        try {
            await controller(req, res);
        }
        catch (err) {
            console.error("Error :", err);
            res.json({ success: false });
        }
    };
};
app.use(express_1.default.json());
app.get("/", (req, res) => {
    console.log("Request url:", req.url);
    res.send("Hello 6th crew ! :-D");
});
/**
 * Wilder routes
 */
// create
app.post("/api/wilders", wilders_1.default.create);
// find all
app.get("/api/wilders", wilders_1.default.findAll);
// find
app.get("/api/wilders/:wilderId", asyncHandler(wilders_1.default.find));
// update
app.put("/api/wilders/:wilderId", asyncHandler(wilders_1.default.update));
// delete
app.delete("/api/wilders/:wilderId", wilders_1.default.delete);
// addSkill OU faire un UPDATE du wilder
app.post("/api/wilders/:wilderId/skills", wilders_1.default.addSkills);
// findAllSkills
app.get("/api/wilders/:wilderId/skills", wilders_1.default.findAllSkills);
// deleteSkill
app.delete("/api/wilders/:wilderId/skills/", wilders_1.default.deleteSkills);
/**
 * Skill routes
 */
// create
app.post("/api/skills", skills_1.default.create);
// find all
app.get("/api/skills", skills_1.default.findAll);
// find
app.get("/api/skills/:skillId", skills_1.default.find);
// update
app.put("/api/skills/:skillId", skills_1.default.update);
// delete
app.delete("/api/skills/:skillId", skills_1.default.delete);
/**
 * Upvote routes
 */
// create
app.post("/api/upvotes", asyncHandler(upvotes_1.default.create));
// update - increase
app.put("/api/upvotes/:upvoteId/increase", asyncHandler(upvotes_1.default.increase));
/**
 * Start serverskillsController
 */
app.listen(5000, async () => {
    console.log("Server started on port:5000");
    await utils_1.default.initialize();
    console.log("I'm connected ! ");
});
// makeCrud({ entitySchema: {
//   name: "Skill",
//   columns: {
//     id: {
//       primary: true,
//       type: "int",
//       generated: true,
//     },
//     name: {
//       type: "text",
//     },
//   },
// } })
