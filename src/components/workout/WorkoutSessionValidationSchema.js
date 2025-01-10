import * as Yup from "yup";

const workoutSessionValidationSchema = Yup.object({
    date: Yup.date().required('Data jest wymagana'),
    note: Yup.string(),
    exercises: Yup.array()
        .of(
            Yup.object({
                exerciseId: Yup.number().required('Wybierz ćwiczenie'),
                sets: Yup.array()
                    .of(
                        Yup.object({
                            reps: Yup.number()
                                .required('Podaj liczbę powtórzeń')
                                .min(1, 'Liczba powtórzeń musi być większa niż 0'),
                            weight: Yup.mixed()
                                .transform((value, originalValue) => {
                                    if (!originalValue) return undefined;
                                    const converted = String(originalValue).replace(',', '.');
                                    const number = parseFloat(converted);
                                    return isNaN(number) ? undefined : number;
                                })
                                .test('is-number', 'Podaj prawidłową wartość', value => !isNaN(value))
                                .required('Podaj ciężar')
                                .test('min', 'Ciężar musi być większy lub równy 0', value => value >= 0)
                                .test('max', 'Ciężar nie może być większy niż 1000kg', value => value <= 1000)
                        })
                    )
                    .min(1, 'Przynajmniej jeden zestaw jest wymagany'),
            })
        )
        .min(1, 'Przynajmniej jedno ćwiczenie jest wymagane'),
});

export default workoutSessionValidationSchema;