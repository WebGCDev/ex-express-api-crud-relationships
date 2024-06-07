const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//creazione db

exports.createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const newCategory = await prisma.category.create({
      data: { name }, //Crea una nuova categoria nel db utilizzando Prisma
    });
    res.status(201).json(newCategory); //stato 201 (Created) e restituisce la nuova categoria creata
  } catch (error) {
    res.status(500).json({
      error: 'Impossibile creare la categoria',
      details: error.message,
    });
  }
};

//recupero db

exports.getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany(); //Recupera tutte le categorie presenti nel database
    res.status(200).json(categories); //stato 200 (OK) e restituisce tutte le categorie presenti nel database
  } catch (error) {
    res.status(500).json({
      error: 'Impossibile recuperare le categorie',
      details: error.message,
    });
  }
};
