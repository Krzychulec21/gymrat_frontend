import * as Yup from "yup";

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Nazwa jest wymagana"),
    description: Yup.string().max(500, "Opis nie może przekraczać 500 znaków"),
    exercises: Yup.array()
        .of(
            Yup.object().shape({
                exerciseId: Yup.number().required("Wybierz ćwiczenie"),
                customInstructions: Yup.string().max(500, "Instrukcja do ćwiczenia nie może przekraczać 500 znaków")
            })
        )
        .min(1, "Dodaj przynajmniej jedno ćwiczenie")
});

export default validationSchema;