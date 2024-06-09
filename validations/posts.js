const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const bodyData = {
  title: {
    in: ["body"],
    notEmpty: {
      errorMessage: 'Title is a required field.',
      bail: true
    },
    isString: {
      errorMessage: 'Title must be a string.',
      bail: true
    },
    isLength: {
      errorMessage: 'Title must be at least 3 characters long.',
      options: { min: 3 }
    }
  },
  img: {
    in: ["body"],
    optional: {
      options: { nullable: true },
    },
    isString: {
      errorMessage: 'Image must be a string.',
      bail: true,
    },
    matches: {
      options: [/\.(jpg|jpeg|png|gif)$/i],
      errorMessage: 'Image must have a valid extension (jpg, jpeg, png, gif).',
    }
  },
  content: {
    in: ["body"],
    notEmpty: {
      errorMessage: 'Content is a required field.',
      bail: true
    },
    isString: {
      errorMessage: 'Content must be a string.',
      bail: true
    },
    isLength: {
      errorMessage: 'Content must be at least 3 characters long.',
      options: { min: 3 }
    }
  },
  published: {
    in: ["body"],
    isBoolean: {
      errorMessage: 'Published must be a boolean.'
    }
  },
  categoryId: {
    in: ["body"],
    isInt: {
      errorMessage: 'Category ID must be an integer.',
      bail: true,
    },
    custom: {
      options: async (value) => {
        const categoryId = parseInt(value);
        const category = await prisma.category.findUnique({
          where: { id: categoryId }
        });
        if (!category) {
          throw new Error(`Category with ID ${categoryId} does not exist.`);
        }
        return true;
      }
    }
  },
  tags: {
    in: ["body"],
    notEmpty: {
      errorMessage: 'Tags are required.',
      bail: true,
    },
    isArray: {
      errorMessage: 'Tags must be an array.',
    },
    custom: {
      options: async (ids) => {
        if (ids.length === 0) {
          throw new Error('A post must have at least one tag.');
        }
        const invalidId = ids.find(id => isNaN(parseInt(id)));
        if (invalidId) {
          throw new Error('One or more IDs are not integers.');
        }
        const tags = await prisma.tag.findMany({
          where: { id: { in: ids } }
        });
        if (tags.length !== ids.length) {
          throw new Error('One or more specified tags do not exist.');
        }
        return true;
      }
    }
  }
};

module.exports = {
  bodyData,
};