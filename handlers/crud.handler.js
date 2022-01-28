const Mongoose = require('mongoose');
const catch_async = require('../utils/catch_async');
const Models = require('../helpers/models.helper');
const APIAddons = require('../utils/api_addons');
const _Error = require('../utils/_error');

exports.create = (collection, fields_array) =>
  catch_async(async (req, res, next) => {
    const filtered_body = fields_array.reduce(
      (acc, field) => {
        acc[field] = req.body[field];
        return acc;
      },
      {}
    );

    const document = await Models[collection].create({
      ...filtered_body,
      byUser: '61f30ec111a0666615d7b059',
    });

    if (!document) {
      return next(
        new _Error(`${collection} not created`, 404)
      );
    }

    res.status(201).json({
      status: 201,
      data: document,
      message: `${
        document.name || document._id
      } :  ${collection} created successfully`,
    });
  });

exports.find = (collection) =>
  catch_async(async (req, res) => {
    const with_addons = new APIAddons(
      Models[collection],
      req.query
    )
      .filter()
      .sort()
      .select()
      .paginate()
      .populate();

    const documents = await with_addons.query;

    res.status(201).json({
      status: 201,
      data: documents,
      message: `'${documents.length}' : ${collection} fetched successfully !`,
    });
  });

exports.find_by_id = (collection) =>
  catch_async(async (req, res, next) => {
    const document = await Models[collection].findById(
      Mongoose.Types.ObjectId(req.params.id)
    );

    if (!document) {
      return next(
        new _Error(
          `No document found with ID : ${req.params.id}`,
          404
        )
      );
    }

    res.status(201).json({
      status: 201,
      data: document,
      message: `${
        document.name || document._id
      } :  ${collection} retrieved`,
    });
  });

exports.update = (collection, fields_array) =>
  catch_async(async (req, res, next) => {
    // Get the properties from the req.body that are in the fields_array

    const filtered_body = fields_array.reduce(
      (acc, field) => {
        acc[field] = req.body[field];
        if (acc[field] === undefined) delete acc[field];
        return acc;
      },
      {}
    );

    const document = await Models[collection].findById(
      req.params.id
    );

    if (!document) {
      return next(
        new _Error(
          `No document found with ID : ${req.params.id}`,
          204
        )
      );
    }

    if (
      document.byUser.toString() !==
      req.authorized.id.toString()
    ) {
      return next(
        new _Error(
          `You are not authorized to update this ${collection}`,
          401
        )
      );
    }

    // update filed of the document with the filtered_body
    Object.keys(filtered_body).forEach((key) => {
      document[key] = filtered_body[key];
    });

    await document.save();

    res.status(202).json({
      status: 202,
      data: document,
      message: `${
        document.name || document._id
      } :  ${collection} updated successfully with data: ${
        req.body
      }`,
    });
  });

exports.remove = (collection, callback) =>
  catch_async(async (req, res, next, session) => {
    // Get the properties from the req.body that are in the fields_array

    const document = await Models[collection].findById(
      req.params.id
    );

    if (!document) {
      return next(
        new _Error(
          `No document found with ID : ${req.params.id}`,
          204
        )
      );
    }

    if (
      document.byUser.toString() !==
      req.authorized.id.toString()
    ) {
      return next(
        new _Error(
          `You are not authorized to delete this ${collection}`,
          401
        )
      );
    }

    await document.remove({ session });

    res.status(202).json({
      status: 202,
      data: document,
      message: `${req.params.id} :  ${collection} removed successfully with data: ${req.body}`,
    });
  });
