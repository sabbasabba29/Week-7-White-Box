import { NumericKeys, OperatorKeys } from "../enums";
import { ICalculatorState, IContext, IStateData } from "../interfaces";
import { CalculatorModel } from "../models/calculator.model";
import { StateData } from "../models/state-data.model";
import { EnteringFirstNumberState } from "./entering-first-number.state";
import { EnteringSecondNumberState } from "./entering-second-number.state";

describe("states", (): void => {
  describe("EnteringSecondNumberState", (): void => {
    let enteringSecondNumberState: EnteringSecondNumberState;
    let calculatorModel: IContext;
    let stateData: IStateData;

    beforeEach((): void => {
      calculatorModel = new CalculatorModel();
      stateData = new StateData.Builder().build();
      enteringSecondNumberState = new EnteringSecondNumberState(
        calculatorModel,
        stateData
      );
    });

    afterEach((): void => {
      jest.clearAllMocks();
      enteringSecondNumberState = null;
      calculatorModel = null;
      stateData = null;
    });

    describe("digit()", (): void => {
      it("should replace firstBuffer with input if firstBuffer is 0", (): void => {
        enteringSecondNumberState.data.secondBuffer = "0";

        enteringSecondNumberState.digit(NumericKeys.ONE);

        expect(enteringSecondNumberState.data.secondBuffer).toEqual("1");
      });

      it("should append the input digit to the firstBuffer if firstBuffer is not 0", (): void => {
        enteringSecondNumberState.digit(NumericKeys.ONE);

        expect(enteringSecondNumberState.data.secondBuffer).toEqual("1");
      });
    });

    describe("decimalSeparator()", (): void => {
      it("should add a decimal point to firstBuffer if the buffer is currently empty", (): void => {
        enteringSecondNumberState.decimalSeparator();

        expect(enteringSecondNumberState.data.secondBuffer).toEqual(".");
      });

      it("should add a decimal point at the end of firstBuffer if the buffer is not empty", (): void => {
        enteringSecondNumberState.data.secondBuffer = "12";

        enteringSecondNumberState.decimalSeparator();

        expect(enteringSecondNumberState.data.secondBuffer).toEqual("12.");
      });

      it("should do nothing if firstBuffer already contains a decinal point", (): void => {
        enteringSecondNumberState.data.secondBuffer = "12.34";

        enteringSecondNumberState.decimalSeparator();

        expect(enteringSecondNumberState.data.secondBuffer).toEqual("12.34");
      });
    });

    describe("binaryOperator()", (): void => {
      it("should convert to 1+1 to 2+ when the next operator is +", (): void => {
        enteringSecondNumberState.data.firstBuffer = "1";
        enteringSecondNumberState.data.firstOperator = OperatorKeys.PLUS;
        enteringSecondNumberState.data.secondBuffer = "1";

        jest.spyOn(enteringSecondNumberState, "add").mockReturnValue(2);

        enteringSecondNumberState.binaryOperator(OperatorKeys.PLUS);
        expect(enteringSecondNumberState.data.firstBuffer).toEqual("2");
        expect(enteringSecondNumberState.data.firstOperator).toEqual(
          OperatorKeys.PLUS
        );
        expect(enteringSecondNumberState.data.secondBuffer).toEqual("");
        expect(enteringSecondNumberState.add).toHaveBeenCalledWith(1, 1);
      });

      it("should convert 2*3 to 6+ when the next operator is +", (): void => {
        enteringSecondNumberState.data.firstBuffer = "2";
        enteringSecondNumberState.data.firstOperator = OperatorKeys.MULT;
        enteringSecondNumberState.data.secondBuffer = "3";

        jest.spyOn(enteringSecondNumberState, "multiply").mockReturnValue(6);

        enteringSecondNumberState.binaryOperator(OperatorKeys.PLUS);
        expect(enteringSecondNumberState.data.firstBuffer).toEqual("6");
        expect(enteringSecondNumberState.data.firstOperator).toEqual(
          OperatorKeys.PLUS
        );
        expect(enteringSecondNumberState.data.secondBuffer).toEqual("");
        expect(enteringSecondNumberState.multiply).toHaveBeenCalledWith(2, 3);
      });

      it("should not convert 2+3 to 6* when the next operator is *", (): void => {
        enteringSecondNumberState.data.firstBuffer = "2";
        enteringSecondNumberState.data.firstOperator = OperatorKeys.PLUS;
        enteringSecondNumberState.data.secondBuffer = "3";

        jest.spyOn(enteringSecondNumberState, "multiply").mockReturnValue(6);

        enteringSecondNumberState.binaryOperator(OperatorKeys.PLUS);
        expect(enteringSecondNumberState.data.firstBuffer).toEqual("6");
        expect(enteringSecondNumberState.data.firstOperator).toEqual(
          OperatorKeys.PLUS
        );
        expect(enteringSecondNumberState.data.secondBuffer).toEqual("");
        expect(enteringSecondNumberState.multiply).toHaveBeenCalledWith(2, 3);
      });

      afterEach((): void => {
        jest.restoreAllMocks();
        enteringSecondNumberState = null;
        calculatorModel = null;
        stateData = null;
      });
    });

    describe("equals()", (): void => {
      it("should return 2 when 1 + 1 equals is pressed", (): void => {
        enteringSecondNumberState.data.firstBuffer = "1";
        enteringSecondNumberState.data.firstOperator = OperatorKeys.PLUS;
        enteringSecondNumberState.data.secondBuffer = "1";

        jest.spyOn(enteringSecondNumberState, "add").mockReturnValue(2);

        enteringSecondNumberState.equals();

        expect(enteringSecondNumberState.data.firstBuffer).toEqual("2");
        expect(enteringSecondNumberState.data.secondBuffer).toEqual("");
        expect(enteringSecondNumberState.add).toHaveBeenCalledWith(1, 1);
      });

      it("should return 2 when 5 - 3 equals is pressed", (): void => {
        enteringSecondNumberState.data.firstBuffer = "5";
        enteringSecondNumberState.data.firstOperator = OperatorKeys.MINUS;
        enteringSecondNumberState.data.secondBuffer = "3";

        jest.spyOn(enteringSecondNumberState, "subtract").mockReturnValue(2);

        enteringSecondNumberState.equals();

        expect(enteringSecondNumberState.data.firstBuffer).toEqual("2");
        expect(enteringSecondNumberState.data.secondBuffer).toEqual("");
        expect(enteringSecondNumberState.subtract).toHaveBeenCalledWith(5, 3);
      });

      it("should return 8 when 4 * 2 equals is pressed", (): void => {
        enteringSecondNumberState.data.firstBuffer = "4";
        enteringSecondNumberState.data.firstOperator = OperatorKeys.MULT;
        enteringSecondNumberState.data.secondBuffer = "2";

        jest.spyOn(enteringSecondNumberState, "multiply").mockReturnValue(8);

        enteringSecondNumberState.equals();

        expect(enteringSecondNumberState.data.firstBuffer).toEqual("8");
        expect(enteringSecondNumberState.data.secondBuffer).toEqual("");
        expect(enteringSecondNumberState.multiply).toHaveBeenCalledWith(4, 2);
      });

      it("should return 2 when 4 / 2 equals is pressed", (): void => {
        enteringSecondNumberState.data.firstBuffer = "4";
        enteringSecondNumberState.data.firstOperator = OperatorKeys.DIV;
        enteringSecondNumberState.data.secondBuffer = "2";

        jest.spyOn(enteringSecondNumberState, "multiply").mockReturnValue(2);

        enteringSecondNumberState.equals();

        expect(enteringSecondNumberState.data.firstBuffer).toEqual("2");
        expect(enteringSecondNumberState.data.secondBuffer).toEqual("");
        expect(enteringSecondNumberState.multiply).toHaveBeenCalledWith(4, 2);
      });

      afterEach((): void => {
        jest.restoreAllMocks();
        enteringSecondNumberState = null;
        calculatorModel = null;
        stateData = null;
      });
    });

    describe("clear()", (): void => {
      it("should transition to EnteringFirstNumberState with empty state", (): void => {
        const expectedState: ICalculatorState = new EnteringFirstNumberState(
          calculatorModel,
          new StateData.Builder().build()
        );
        jest.spyOn(calculatorModel, "changeState").mockReturnValue(null);

        enteringSecondNumberState.clear();

        expect(calculatorModel.changeState).toHaveBeenCalledWith(expectedState);
      });
    });

    describe("display()", (): void => {
      it("should call through to state.display()", (): void => {
        jest.spyOn(stateData, "display").mockReturnValue("displayValue");

        enteringSecondNumberState.display();

        expect(stateData.display).toHaveBeenCalledWith();
      });

      it("should call return the value returned by state.display()", (): void => {
        jest.spyOn(stateData, "display").mockReturnValue("displayValue");

        const returnedValue: string = enteringSecondNumberState.display();

        expect(returnedValue).toEqual("displayValue");
      });
    });
  });
});
