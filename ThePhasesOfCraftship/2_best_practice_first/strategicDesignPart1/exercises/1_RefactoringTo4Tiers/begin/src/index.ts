import application from "./bootstrap";

const PORT = Number(process.env.PORT || 3000);

application.start(PORT);

// POST student assignment graded
// app.post("/student-assignments/grade", async (req: Request, res: Response) => {
//   try {
//     if (isMissingKeys(req.body, ["id", "grade"])) {
//       return res
//         .status(400)
//         .json({ error: Errors.ValidationError, data: undefined, success: false });
//     }

//     const { id, grade } = req.body;

//     // validate grade
//     if (!["A", "B", "C", "D"].includes(grade)) {
//       return res
//         .status(400)
//         .json({ error: Errors.ValidationError, data: undefined, success: false });
//     }

//     // check if student assignment exists
//     const studentAssignment = await prisma.studentAssignment.findUnique({
//       where: {
//         id,
//       },
//     });

//     if (!studentAssignment) {
//       return res
//         .status(404)
//         .json({ error: Errors.AssignmentNotFound, data: undefined, success: false });
//     }

//     const studentAssignmentUpdated = await prisma.studentAssignment.update({
//       where: {
//         id,
//       },
//       data: {
//         grade,
//       },
//     });

//     res
//       .status(200)
//       .json({ error: undefined, data: parseForResponse(studentAssignmentUpdated), success: true });
//   } catch (error) {
//     res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
//   }
// });
