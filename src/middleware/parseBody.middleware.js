// middleware/parseBody.middleware.js
import express from 'express';

export const parseBody = [
  express.urlencoded({ extended: true }),
  express.json(),
];

export default parseBody.middleware;