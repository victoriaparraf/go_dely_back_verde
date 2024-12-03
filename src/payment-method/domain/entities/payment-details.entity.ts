import { Entity } from "src/common/domain/entity";

export abstract class PaymentDetails extends Entity<string> {
    abstract validate(): void;
}

export class CashPaymentDetails extends PaymentDetails {
    private currency: string;
    private denominations: { denomination: number; quantity: number }[];

    constructor(id: string, currency: string, denominations: { denomination: number; quantity: number }[]) {
        super(id);
        this.currency = currency;
        this.denominations = denominations;
    }

    validate(): void {
        if (!this.currency || this.denominations.length === 0) {
            throw new Error('Invalid cash payment details.');
        }
    }
}

export class MobilePaymentDetails extends PaymentDetails {
    private phoneNumber: string;
    private bank: string;
    private idNumber: string;
    private referenceNumber: string;

    constructor(id: string, phoneNumber: string, bank: string, idNumber: string, referenceNumber: string) {
        super(id);
        this.phoneNumber = phoneNumber;
        this.bank = bank;
        this.idNumber = idNumber;
        this.referenceNumber = referenceNumber;
    }

    validate(): void {
        if (!this.phoneNumber || !this.bank || !this.referenceNumber) {
            throw new Error('Invalid mobile payment details.');
        }
    }
}

export class CardPaymentDetails extends PaymentDetails {
    private cardNumber: string;
    private cvc: string;
    private cardholderName: string;

    constructor(id: string, cardNumber: string, cvc: string, cardholderName: string) {
        super(id);
        this.cardNumber = cardNumber;
        this.cvc = cvc;
        this.cardholderName = cardholderName;
    }

    validate(): void {
        if (!this.cardNumber || !this.cvc || !this.cardholderName) {
            throw new Error('Invalid card payment details.');
        }
    }
}
