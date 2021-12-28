const deadlineCost = require('./correctarium');

test('counting cost and deadline', () => {
    expect(deadlineCost("rus", "doc", 2941, "2021-11-30 11:15")).toStrictEqual([ '147.05', '3', 1638274500, 'Tue Nov 30 2021 14:15:00 GMT+0200' ]);
    expect(deadlineCost("eng", "null", 970, "2021-12-04 18:00")).toStrictEqual([ '139.68', '3', 1638788400, 'Mon Dec 06 2021 13:00:00 GMT+0200' ]);
    expect(deadlineCost("ukr", "other", 970, "2021-12-01 14:25")).toStrictEqual([ '58.20', '1', 1638365100, 'Wed Dec 01 2021 15:25:00 GMT+0200' ]);
    expect(deadlineCost("eng", "rtf", 1216, "2021-12-02 18:45")).toStrictEqual([ '145.92', '4', 1638531900, 'Fri Dec 03 2021 13:45:00 GMT+0200' ]);
    expect(deadlineCost("rus", "doc", 2500, "2021-12-03 22:15")).toStrictEqual([ '125.00', '2', 1638784800, 'Mon Dec 06 2021 12:00:00 GMT+0200' ]);
    expect(deadlineCost("ukr", "other", 10000, "2021-12-06 23:30")).toStrictEqual([ '600.00', '8', 1638892800, 'Tue Dec 07 2021 18:00:00 GMT+0200' ]);
    expect(deadlineCost("eng", "other", 20000, "2021-12-13 21:50")).toStrictEqual([ '2880.00', '61', 1640185200, 'Wed Dec 22 2021 17:00:00 GMT+0200' ]);
  });