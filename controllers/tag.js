const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createTag = async (req, res) => {
  const { name } = req.body;
  try {
    const newTag = await prisma.tag.create({
      //crea un nuovo tag nel database
      data: { name },
    });
    res.status(201).json(newTag); //stato 201 (Created) e restituisce il nuovo tag creato
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Impossibile creare il tag', details: error.message });
  }
};

exports.getTags = async (req, res) => {
  try {
    const tags = await prisma.tag.findMany(); //recupera tutti i tag presenti nel database
    res.status(200).json(tags); //stato 200 (OK) e restituisce tutti i tag recuperati.
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Impossibile recuperare i tag', details: error.message });
  }
};
