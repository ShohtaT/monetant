// 支払いエンティティ（ドメイン層）
export class Payment {
  constructor(
    public title: string,
    public amount: number
  ) {}

  static create(title: string, amount: number) {
    if (!title) throw new Error('タイトル必須');
    if (amount <= 0) throw new Error('金額は正の数');
    return new Payment(title, amount);
  }
}
