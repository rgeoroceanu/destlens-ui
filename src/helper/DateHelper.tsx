class DateHelper {

  static formatDateRange(start: string | number | Date, end: string | number | Date, locale: Intl.LocalesArgument): string {
    return new Date(start).toLocaleDateString(locale) + " - " + new Date(end).toLocaleDateString(locale)
  }

  static getDateFormatString(locale: string): string {
    const options = {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    };

    const formatObj = new Intl.DateTimeFormat(locale, options as Intl.DateTimeFormatOptions).formatToParts(
      Date.now()
    );

    return formatObj
      .map((obj) => {
        switch (obj.type) {
          case "day":
            return "dd";
          case "month":
            return "MM";
          case "year":
            return "yyyy";
          default:
            return obj.value;
        }
      })
      .join("");
  }

}

export default DateHelper;
