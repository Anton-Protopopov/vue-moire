export default function namberFormat(value) {
  return new Intl.NumberFormat().format(value);
}
