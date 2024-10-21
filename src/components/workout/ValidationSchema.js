import * as Yup from "yup";

const validationSchema = Yup.object({
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
                            weight: Yup.number()
                                .required('Podaj ciężar')
                                .min(0, 'Ciężar musi być większy lub równy 0'),
                        })
                    )
                    .min(1, 'Przynajmniej jeden zestaw jest wymagany'),
            })
        )
        .min(1, 'Przynajmniej jedno ćwiczenie jest wymagane'),
});

export default validationSchema;