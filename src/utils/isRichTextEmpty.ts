export default function isRichTextEmpty(value: string) {
    if (
      value.replace(/<(.|\n)*?>/g, "").trim().length === 0 &&
      !value.includes("<img")
    ) {
      return true;
    }
    return false;
  }