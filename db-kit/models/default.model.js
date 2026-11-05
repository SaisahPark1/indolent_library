const mongoose = require('mongoose');

const DEFAULT_HIDDEN = ['password'];

function createSchema(definition, options = {}) {
  const { hide = DEFAULT_HIDDEN, ...schemaOptions } = options;

  const schema = new mongoose.Schema(definition, {
    timestamps: true,     // createdAt / updatedAt
    versionKey: false,    // no __v
    ...schemaOptions,     // per-model overrides win
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        hide.forEach(field => delete ret[field]);
        return ret;
      },
      ...(schemaOptions.toJSON || {}),
    },
  });

  return schema;
}

module.exports = { createSchema };