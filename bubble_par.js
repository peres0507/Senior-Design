var BUBBLE_PAR = {
    "data_file": "data.csv",
    "report_title": "Weekly Delays in MTA Buses: M100 and M101",
    "width": 940,
    "height": 700,
    "force_strength": 0.03,
    "force_type": "charge",
    "radius_field": "Delay (Seconds)",
    "numeric_fields": ["Time (Military Hours)", "Delay (Seconds)"],
    "fill_color": {
        "data_field": "Bus",
        "color_groups": {
            "M101": "#87CEFA",
            "M100": "#FFC0CB"
        }
    },
    "tooltip": [
        {"title": "Bus", "data_field": "Bus"},
        {"title": "Delay (Seconds)", "data_field": "Delay (Seconds)"},
        {"title": "Common Bus Stop", "data_field": "Bus Stop"},
        {"title": "Time (Military Hours)", "data_field": "Time (Military Hours)"}


    ],
    "modes": [
        {
            "button_text": "All Delays",
            "button_id": "all",
            "type": "grid",
            "labels": null,
            "grid_dimensions": {"rows": 1, "columns": 1},
            "data_field": null
        },
        {
            "button_text": "Delay by Separate Bus",
            "button_id": "Bus",
            "type": "grid",
            "labels": ["M100","M101"],
            "grid_dimensions": {"rows": 1, "columns": 3},
            "data_field": "Bus"
        },
        {
            "button_text": "Delays at Peak Hours",
            "button_id": "Time (Military Hours)_vs_Delay (Seconds)",
            "type": "scatterplot",
            "x_data_field": "Time (Military Hours)",
            "y_data_field": "Delay (Seconds)",
            "x_format_string": ",.2r",
            "y_format_string": ",.2r"
        },

    ]
};
