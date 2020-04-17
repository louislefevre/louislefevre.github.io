/*
 * Metalsmith Set-date
 * Ensures every file has a date set
 * Adds dateFormat metadata with formatted creation date
 */
module.exports = function()
{
  'use strict';

  var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return function(files, metalsmith, done)
  {
    var file, f;

    for (f in files)
    {
      file = files[f];
      file.date =
        (Date.parse(file.date) && new Date(file.date)) ||
        (Date.parse(file.publish) && new Date(file.publish)) ||
        (file.stats && file.stats.ctime) || new Date();

      file.dateFormat =
        file.date.getUTCDate() + ' ' +
        month[file.date.getUTCMonth()] + ' ' +
        file.date.getUTCFullYear();
    }

    done();
  };
};
