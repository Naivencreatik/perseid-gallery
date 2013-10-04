AlphaNumericNonEmptyString = Match.Where(function (x) {
    check(x, String);

    x = x.trim();

    return (/^[a-z0-9 ]+$/i).test(x);
});